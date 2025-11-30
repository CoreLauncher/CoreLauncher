import type { JSONObject } from "@corelauncher/json-value";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import { parse as parseVDF } from "@node-steam/vdf";
import { parse as parseBinaryKV } from "binarykvparser";
import { EMsg } from "../protobuf/generated/enums_clientserver";
import type {
	CMsgClientLicenseList,
	CMsgClientLicenseList_License,
} from "../protobuf/generated/steammessages_clientserver";
import type { CMsgClientPICSProductInfoResponse } from "../protobuf/generated/steammessages_clientserver_appinfo";
import type { SteamAppInfo } from "../types/SteamAppInfo";
import type { SteamPackageInfo } from "../types/SteamPackageInfo";
import SteamAPI from "./SteamAPI";
import { SteamApp } from "./SteamApp";
import SteamToken from "./SteamToken";
import WebsocketTransport from "./transport/WebsocketTransport";

type SteamClientOptions = {
	refreshToken: string;
};

type SteamClientEvents = {
	/**
	 * Emitted when the client has connected to the Steam servers
	 */
	connected: () => void;

	/**
	 * Emitted when the client is logged in
	 */
	ready: () => void;

	/**
	 * Emitted when the owned apps have been fetched
	 */
	apps: () => void;
};

export class SteamClient extends TypedEmitter<SteamClientEvents> {
	private api: SteamAPI;
	private transport: WebsocketTransport;

	/**
	 * Steam Token the client is currently using
	 */
	token: SteamToken;

	/**
	 * Owned Steam Apps (Currently only holds games)
	 */
	apps: SteamApp[];

	/**
	 * Owned Steam Licenses
	 */
	licenses: CMsgClientLicenseList_License[];

	constructor(options: SteamClientOptions) {
		super();
		this.token = new SteamToken(options.refreshToken);
		this.api = new SteamAPI();
		this.transport = new WebsocketTransport(this);

		this.licenses = [];
		this.apps = [];

		// Logon when connected
		this.transport.on("connected", () => {
			this.transport.send(EMsg.k_EMsgClientLogon, {
				shouldRememberPassword: true,
				obfuscatedPrivateIp: { v4: 0 },
				protocolVersion: 65580,
				supportsRateLimitResponse: true,
				machineName: "",
				clientLanguage: "english",
				clientOsType: 16,
				chatMode: 2,
				accessToken: options.refreshToken,
				// cellId: 15,
				// machineId: "",
			});
		});

		// Handle license list
		this.transport.on("message", async (message) => {
			const type = message.type;
			const body = message.body as CMsgClientLicenseList;
			if (type !== EMsg.k_EMsgClientLicenseList) return;

			const licenses = body.licenses;
			this.licenses = licenses || [];

			const { packages } = await this.requestProductInformation({
				packages: licenses?.map((license) => license.packageId as number),
			});

			const appids: number[] = [];

			for (const pkg of packages) {
				pkg.appids
					.filter((appid) => !appids.includes(appid))
					.forEach((appid) => {
						appids.push(appid);
					});
			}

			const { apps } = await this.requestProductInformation({
				apps: appids,
			});

			this.apps = apps
				.filter((app) => app.common?.type === "Game")
				.map((app) => new SteamApp(this, app));
			this.emit("apps");
		});

		// Start by fetching a CM list and connecting to the first one
		this.api
			.fetch("GET", "ISteamDirectory", "GetCMListForConnect", "1", {
				cmtype: "websockets",
				maxcount: 10,
			})
			.then((response) => {
				const endpoint = response.serverlist[0]?.endpoint;
				if (!endpoint) throw new Error("No endpoint found");

				this.transport.connect(endpoint);
			});
	}

	private async requestProductInformation(options: {
		apps?: number[];
		packages?: number[];
	}) {
		const returnedApps: SteamAppInfo[] = [];
		const returnedPackages: SteamPackageInfo[] = [];

		await new Promise((resolve) => {
			this.transport.send(
				EMsg.k_EMsgClientPICSProductInfoRequest,
				{
					apps:
						options.apps?.map((appid) => {
							return { appid };
						}) ?? [],
					packages:
						options.packages?.map((packageid) => {
							return {
								packageid,
								accessToken: this.licenses.find(
									(l) => l.packageId === packageid,
								)?.accessToken,
							};
						}) ?? [],
				},
				{
					wait: true,
					callback: (message) => {
						const body = message.body as CMsgClientPICSProductInfoResponse;

						const parsedApps = body.apps?.map((app) => {
							const buffer = Buffer.from(
								app.buffer as unknown as string,
								"base64",
							);
							const vdf = buffer.toString("utf-8").replace(/\0$/, "");
							return parseVDF(vdf).appinfo;
						}) as SteamAppInfo[];

						const parsedPackages = body.packages
							?.map((pkg) => {
								const buffer = Buffer.from(
									pkg.buffer as unknown as string,
									"base64",
								);
								const parsed = parseBinaryKV(buffer) as JSONObject;
								return parsed[pkg.packageid!.toString()];
							})
							.filter((p) => p) as SteamPackageInfo[];

						if (parsedApps) returnedApps.push(...parsedApps);
						if (parsedPackages) returnedPackages.push(...parsedPackages);

						if (!body.responsePending) resolve(undefined);
					},
				},
			);
		});

		return {
			apps: returnedApps,
			packages: returnedPackages,
		};
	}
}
