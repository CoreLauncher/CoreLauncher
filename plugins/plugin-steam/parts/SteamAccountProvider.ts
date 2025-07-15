import { readFileSync } from "node:fs";
import { SizeConstraint, Window } from "@corebyte/webwindow";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { isProduction } from "@corelauncher/is-production";
import type { AccountProviderShape } from "@corelauncher/types";
import SteamSVG from "bootstrap-icons/icons/steam.svg" with { type: "file" };
import { env } from "bun";
import getPort from "get-port";
import { EAuthTokenPlatformType, LoginSession } from "steam-session";
import recolorSVG from "../../../packages/recolor-svg";
import indexHTML from "../public/index.html";

const port = isProduction ? await getPort() : 4000;
const machineName = `${env.USERNAME}@${env.USERDOMAIN} (CoreLauncher)`;

export class SteamAccountProvider implements AccountProviderShape {
	id = "steam";
	name = "Steam";
	color = "#1a9fff";
	logo = dataToDataURL(
		recolorSVG(readFileSync(SteamSVG, "utf-8"), "#ffffff"),
		"image/svg+xml",
	);

	private server: Bun.Server;
	private session: LoginSession;
	private window: Window;
	constructor() {
		const serveOptions = {
			port,
			host: "localhost",
			development: {
				hmr: true,
				console: true,
			},
			routes: {
				"/": indexHTML,
			},
			websocket: {
				open: (websocket) => {
					websocket.subscribe("");
				},
			},
		} as Parameters<typeof Bun.serve>[0];

		console.info(`Starting steam internal server on http://localhost:${port}`);

		this.server = Bun.serve(serveOptions);
		this.server.unref();

		this.session = new LoginSession(EAuthTokenPlatformType.SteamClient, {
			machineFriendlyName: machineName,
		});

		this.session.startWithQR().then((s) => {
			console.log(s.qrChallengeUrl);
		});

		this.session.on("remoteInteraction", () => {
			console.log("Remote interaction detected.");
			this.server.publish("", "");
		});

		const windowOptions = {
			debug: !isProduction,
			title: "Connect Steam Account",
			url: `http://localhost:${port}`,
			// show: false,
			show: true,
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
