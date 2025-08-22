import { SizeConstraint, Window } from "@corebyte/webwindow";
import { isProduction } from "@corelauncher/is-production";
import type { JSONValue } from "@corelauncher/json-value";
// import { Tray } from "@corelauncher/tray";
import {
	PluginClass,
	type PluginPortal,
	type PluginShape,
} from "@corelauncher/types";
import type { BunRequest } from "bun";
import getPort from "get-port";
import temporaryDirectory from "temp-dir";
import indexHTML from "./public/index.html";
import { getVersion } from "./util/version" with { type: "macro" };

const port = await getPort({ port: isProduction ? undefined : 3000 });

const icon = await import("../../icon.ico", {
	with: { type: "file" },
});
const tempIcon = `${temporaryDirectory}/corelauncher-tray-icon.ico`;
await Bun.write(tempIcon, Bun.file(icon.default));

export const id = "plugin-react-frontend";
export const format = 1;
export const name = "React frontend";
export const description =
	"A pretty frontend for CoreLauncher using React and a browserview.";

export class Plugin extends PluginClass implements PluginShape {
	private server: Bun.Server;
	private window: Window;
	private publishedData: Record<string, JSONValue> = {};
	// tray: Tray;
	constructor(portal: PluginPortal) {
		super();

		const serveOptions = {
			port,
			host: "localhost",
			development: {
				hmr: true,
				console: true,
			},
			websocket: {
				open: (ws) => {
					ws.subscribe("client");

					for (const event in this.publishedData) {
						ws.send(
							JSON.stringify({
								type: event,
								data: this.publishedData[event],
							}),
						);
					}
				},
			},
			routes: {
				"/": indexHTML,

				"/api/events": (request) => {
					this.server.upgrade(request);
				},

				"/api/application/version": async () => {
					return Response.json({
						version: getVersion(),
						environment: isProduction ? "production" : "development",
					});
				},

				"/api/games/launch/:id": {
					POST: async (request: BunRequest<"/api/games/launch/:id">) => {
						const gameId = request.params.id;
						const game = portal.getGame(gameId);

						const result = await game.launch();
						return Response.json(result);
					},
				},

				"/api/account-providers/:id/connect": {
					POST: async (
						request: BunRequest<"/api/account-providers/:id/connect">,
					) => {
						const providerId = request.params.id;
						const provider = portal.getAccountProvider(providerId);

						const result = await provider.connect();
						return Response.json(result);
					},
				},
			},
		} as Parameters<typeof Bun.serve>[0];

		console.info(`Starting internal server on http://localhost:${port}`);

		this.server = Bun.serve(serveOptions);

		const windowOptions = {
			debug: !isProduction,
			title: "CoreLauncher",
			url: `http://localhost:${port}`,
			show: true,
			size: {
				width: 1200,
				height: 800,
				constraint: SizeConstraint.MIN,
			},
		} as ConstructorParameters<typeof Window>[0];

		this.window = new Window(windowOptions);
		this.window.on("close", () => {});

		// this.tray = new Tray();
		// this.tray.setLabel("CoreLauncher");
		// this.tray.setIcon(tempIcon);
		// this.tray.on("click", () => {
		// 	console.log("Tray Icon Clicked!", this.window.shown);
		// 	if (this.window.shown) return;
		// 	this.window.show();
		// });

		portal.on("games", (games) => {
			this.publish(
				"games",
				games.map((game) => ({
					id: game.id,
					name: game.name,
				})),
			);
		});

		portal.on("account_providers", (providers) => {
			this.publish(
				"account_providers",
				providers.map((provider) => ({
					id: provider.id,
					name: provider.name,
					color: provider.color,
					logo: provider.logo,
				})),
			);
		});

		portal.on("account_instances", (instances) => {
			this.publish(
				"account_instances",
				instances.map((instance) => ({
					id: instance.id,
					name: instance.name,
					providerId: instance.providerId,
				})),
			);
		});

		this.emit("ready");
	}

	private publish(type: string, data: JSONValue) {
		this.publishedData[type] = data;
		this.server.publish("client", JSON.stringify({ type, data }));
	}
}
