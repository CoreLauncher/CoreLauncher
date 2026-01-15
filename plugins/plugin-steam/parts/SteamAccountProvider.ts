import { readFileSync } from "node:fs";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { isProduction } from "@corelauncher/is-production";
import type { JSONValue } from "@corelauncher/json-value";
import {
	AccountProviderShape,
	DialogType,
	type PluginPortal,
} from "@corelauncher/sdk";
import SteamSVG from "bootstrap-icons/icons/steam.svg" with { type: "file" };
import { env } from "bun";
import getPort from "get-port";
import type { Kysely } from "kysely";
import recolorSVG from "../../../packages/recolor-svg";
import { QRLoginSession } from "../../../packages/steam-client";
import indexHTML from "../public/index.html";
import type { Database } from "../types/database";

const port = await getPort({ port: isProduction ? undefined : 4000 });
const machineName = `${env.USERNAME}@${env.USERDOMAIN} (CoreLauncher)`;

type AccountData = {
	id: number;
	name: string;
	accessToken: string;
	refreshToken: string;
};

interface SteamAccountProviderEvents {
	connection: (data: AccountData) => void;
}

export class SteamAccountProvider extends AccountProviderShape<SteamAccountProviderEvents> {
	id = "steam";
	name = "Steam";
	color = "#1a9fff";
	logoUrl = dataToDataURL(
		recolorSVG(readFileSync(SteamSVG, "utf-8"), "#ffffff"),
		"image/svg+xml",
	);

	private portal: PluginPortal;
	private database: Kysely<Database>;
	private qrLoginSession: QRLoginSession | null = null;
	private server: Bun.Server<never>;
	constructor(portal: PluginPortal, database: Kysely<Database>) {
		super();
		this.portal = portal;
		this.database = database;

		const broadcast = (type: string, data?: JSONValue) => {
			this.server.publish("client", JSON.stringify({ type, data }));
		};

		const send = (
			websocket: Bun.ServerWebSocket<unknown>,
			type: string,
			data?: JSONValue,
		) => {
			websocket.send(JSON.stringify({ type, data }));
		};

		const qrLoginSessionOptions = {
			deviceName: machineName,
		} as ConstructorParameters<typeof QRLoginSession>[0];

		const serveOptions = {
			port,
			host: "localhost",
			development: {
				hmr: true,
				console: true,
			},
			routes: {
				"/": indexHTML,
				"/events": (request) => {
					this.server.upgrade(request);
				},
			},
			websocket: {
				open: (websocket) => {
					websocket.subscribe("client");

					if (!this.qrLoginSession) {
						this.qrLoginSession = new QRLoginSession(qrLoginSessionOptions);

						this.qrLoginSession.on("change", () => {
							broadcast("qr-change", {
								qr: this.qrLoginSession!.challengeUrl,
								state: this.qrLoginSession!.state,
							});
						});

						this.qrLoginSession.on("interaction", () => {
							broadcast("qr-interaction");
						});

						this.qrLoginSession.on("complete", async (data) => {
							this.portal.closeDialog({ id: "steam-account-connection" });

							const { id } = await this.database
								.insertInto("accounts")
								.orReplace()
								.values({
									name: data.accountName,
									accessToken: data.accessToken,
									refreshToken: data.refreshToken,
								})
								.returning("accounts.id")
								.executeTakeFirstOrThrow();

							this.emit("connection", {
								id,
								name: data.accountName,
								accessToken: data.accessToken,
								refreshToken: data.refreshToken,
							});
						});

						return;
					}

					send(websocket, "qr-change", {
						qr: this.qrLoginSession.challengeUrl,
						state: this.qrLoginSession.state,
					});
				},
				message: () => {},
				close: () => {
					const connectionCount = this.server.subscriberCount("client");
					if (connectionCount !== 0) return;
					if (!this.qrLoginSession) return;
					console.info(
						"No more clients connected, destroying QR login session",
					);
					this.qrLoginSession.destroy();
					this.qrLoginSession = null;
				},
			},
		} as Parameters<typeof Bun.serve>[0];

		console.info(`Starting steam internal server on http://localhost:${port}`);

		this.server = Bun.serve(serveOptions);
		this.server.unref();
	}

	connect() {
		console.log("Connecting to Steam account provider...");

		this.portal.showDialog({
			id: "steam-account-connection",
			type: DialogType.Webview,
			url: this.server.url.toString(),
			width: 800,
			height: 400,
		});

		return true;
	}
}
