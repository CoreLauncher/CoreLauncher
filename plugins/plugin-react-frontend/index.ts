import { SizeConstraint, Window } from "@corebyte/webwindow";
import { Tray } from "@corelauncher/tray";
import {
	PluginClass,
	type PluginPortal,
	type PluginShape,
} from "@corelauncher/types";
import { env } from "bun";
import getPort from "get-port";
import indexHTML from "./public/index.html";

Window.check();
const port = env.NODE_ENV === "production" ? await getPort() : 3000;

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

				"/api/games/list": async () => {
					const games = portal.getGames();
					return Response.json(
						games.map((game) => ({
							id: game.id,
							name: game.name,
						})),
					);
				},
			},
		} as Parameters<typeof Bun.serve>[0];

		console.info(`Starting internal server on http://localhost:${port}`);

		this.server = Bun.serve(serveOptions);

		const windowOptions = {
			title: "CoreLauncher",
			url: `http://localhost:${port}`,
			size: {
				width: 1200,
				height: 800,
				constraint: SizeConstraint.MIN,
			},
		} as ConstructorParameters<typeof Window>[0];

		this.window = new Window(windowOptions);
		this.window.on("close", () => {
			this.server.stop();
		});

		this.tray = new Tray();
		this.tray.create("./icon.ico", "Corebittelanceert zichzelf in uwe anus");
		this.tray.onClick(() => {
			console.log("Tray icon clicked!");
		});
		this.emit("ready");
	}
}
