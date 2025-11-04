import { TypedEmitter } from "@corelauncher/typed-emitter";
import { parse as parseVDF } from "@node-steam/vdf";
import { parse as parseBinaryKV } from "binarykvparser";
import {
	type CMsgClientLicenseList,
	type CMsgClientPICSProductInfoResponse,
	EMsg,
} from "../protobuf/compiled";
import type { SteamAppInfo } from "../types/SteamAppInfo";
import type { SteamPackageInfo } from "../types/SteamPackageInfo";
import SteamAPI from "./SteamAPI";
import SteamApp from "./SteamApp";
import SteamToken from "./SteamToken";
import WebsocketTransport from "./transport/WebsocketTransport";

type SteamClientOptions = {
	refreshToken: string;
};

type SteamClientEvents = {
	apps: () => void;
};

export class SteamClient extends TypedEmitter<SteamClientEvents> {
	token: SteamToken;
	api: SteamAPI;
	transport: WebsocketTransport;
	apps: SteamApp[];
	constructor(options: SteamClientOptions) {
		super();
		this.token = new SteamToken(options.refreshToken);
		this.api = new SteamAPI();
		this.transport = new WebsocketTransport(this);
		this.apps = [];

		console.log("Connecting to Steam...");

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
				cellId: 15,
				// machineId: "",
			});
		});

		// Handle license list
		this.transport.on("message", async (message) => {
			const type = message.type;
			const body = message.body as CMsgClientLicenseList;
			if (type !== EMsg.k_EMsgClientLicenseList) return;
			const licenses = body.licenses;
			const { packages } = await this.requestProductInformation({
				packages: licenses?.map((license) => license.packageId as number),
			});
			const { apps } = await this.requestProductInformation({
				apps: packages.flatMap((pkg) => pkg.appids as number[]),
			});
			this.apps = apps
				// .filter((app) => app.common?.type === "Game")
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
		const response = await this.transport.send(
			EMsg.k_EMsgClientPICSProductInfoRequest,
			{
				singleResponse: true,
				apps: options.apps?.map((appid) => {
					return { appid };
				}),
				packages: options.packages?.map((packageid) => {
					return { packageid };
				}),
			},
			{
				wait: true,
			},
		);

		if (!response)
			throw new Error("No response received for product info request");

		const body = response.body as CMsgClientPICSProductInfoResponse;
		console.log(body);

		return {
			apps: body.apps?.map((app) => {
				if (!app.buffer || !app.appid) return false;
				const buffer = Buffer.from(app.buffer as unknown as string, "base64");
				const vdf = buffer.toString("utf-8").replace(/\0$/, "");
				return parseVDF(vdf).appinfo;
			}),
			packages: body.packages
				?.map((pkg) => {
					if (!pkg.buffer || !pkg.packageid) return false;
					const buffer = Buffer.from(pkg.buffer as unknown as string, "base64");
					return parseBinaryKV(buffer)[pkg.packageid];
				})
				.filter((p) => p),
		} as {
			apps: SteamAppInfo[];
			packages: SteamPackageInfo[];
		};
	}
}
