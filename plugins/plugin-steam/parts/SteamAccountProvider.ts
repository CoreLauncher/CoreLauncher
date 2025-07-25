import { readFileSync } from "node:fs";
import { SizeConstraint, Window } from "@corebyte/webwindow";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { isProduction } from "@corelauncher/is-production";
import type { JSONValue } from "@corelauncher/json-value";
import { QRLoginSession } from "@corelauncher/steam-client";
import type { AccountProviderShape } from "@corelauncher/types";
import SteamSVG from "bootstrap-icons/icons/steam.svg" with { type: "file" };
import { env } from "bun";
import getPort from "get-port";
import recolorSVG from "../../../packages/recolor-svg";
import indexHTML from "../public/index.html";

const port = await getPort({ port: isProduction ? undefined : 4000 });
const machineName = `${env.USERNAME}@${env.USERDOMAIN} (CoreLauncher)`;

export class SteamAccountProvider implements AccountProviderShape {
	id = "steam";
	name = "Steam";
	color = "#1a9fff";
	logo = dataToDataURL(
		recolorSVG(readFileSync(SteamSVG, "utf-8"), "#ffffff"),
		"image/svg+xml",
	);

	private qrLoginSession: QRLoginSession | null = null;
	private server: Bun.Server;
	private window: Window;
	constructor() {
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

		// this.qrLoginSession = new QRLoginSession(qrLoginSessionOptions);

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

						this.qrLoginSession.on("complete", () => {
							broadcast("qr-complete");
						});

						return;
					}

					send(websocket, "qr-change", {
						qr: this.qrLoginSession.challengeUrl,
						state: this.qrLoginSession.state,
					});
				},
				close: () => {
					const connectionCount = this.server.subscriberCount("client");
					if (connectionCount !== 0) return;
					if (!this.qrLoginSession) return;
					this.qrLoginSession.destroy();
				},
			},
		} as Parameters<typeof Bun.serve>[0];

		console.info(`Starting steam internal server on http://localhost:${port}`);

		this.server = Bun.serve(serveOptions);
		this.server.unref();

		const windowOptions = {
			debug: !isProduction,
			title: "Connect Steam Account",
			url: `http://localhost:${port}`,
			show: false,
			size: {
				width: 800,
				height: 400,
				constraint: SizeConstraint.FIXED,
			},
		} as ConstructorParameters<typeof Window>[0];

		this.window = new Window(windowOptions);
	}

	connect() {
		console.log("Connecting to Steam account provider...");
		this.window.show();
		return true;
	}
}
