import { SizeConstraint, Window } from "@corebyte/webwindow";
import getPort from "get-port";
import type { PluginShape } from "../../packages/types";
import indexHTML from "./public/index.html";

Window.check();
const port = await getPort();

export const id = "plugin-react-frontend";
export const name = "React frontend";
export const description =
	"A pretty frontend for CoreLauncher using React and a browserview.";

export class Plugin implements PluginShape {
	server: Bun.Server;
	window: Window;
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
		} as Parameters<typeof Bun.serve>[0];

		console.log("Starting server on port", port);

		this.server = Bun.serve(serveOptions);

		const windowOptions = {
			title: "CoreLauncher",
			url: `http://localhost:${port}`,
			size: {
				width: 800,
				height: 600,
				constraint: SizeConstraint.MIN,
			},
		} as ConstructorParameters<typeof Window>[0];

		this.window = new Window(windowOptions);
	}
}
