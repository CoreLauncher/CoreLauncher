import { SizeConstraint, Window } from "@corebyte/webwindow";
import { isProduction } from "@corelauncher/is-production";
import { Tray } from "@corelauncher/tray";
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

const port = isProduction ? await getPort() : 3000;

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
	server: Bun.Server;
	window: Window;
	tray: Tray;
	constructor(portal: PluginPortal) {
		super();

		const serveOptions = {
			port,
			host: "localhost",
			development: {
				hmr: true,
				console: true,
			},
			routes: {
				"/": indexHTML,

				"/api/application/version": async () => {
					return Response.json({
						version: getVersion(),
					});
				},

				"/api/games/list": async () => {
					const games = portal.getGames();
					return Response.json(
						games.map((game) => ({
							id: game.id,
							name: game.name,
						})),
					);
				},

				"/api/games/launch/:id": {
					POST: async (request: BunRequest<"/api/games/launch/:id">) => {
						const gameId = request.params.id;
						const game = portal.getGame(gameId);

						const result = await game.launch();
						return Response.json(result);
					},
				},
			},
		} as Parameters<typeof Bun.serve>[0];

		console.info(`Starting internal server on http://localhost:${port}`);

		this.server = Bun.serve(serveOptions);

		const windowOptions = {
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

		this.tray = new Tray();
		this.tray.create("CoreLauncher", tempIcon);
		this.tray.on("left-click", () => {
			console.log("Tray Icon Clicked!", this.window.shown);
			if (this.window.shown) return;
			this.window.show();
		});

		this.emit("ready");
	}
}
