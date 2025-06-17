import { SizeConstraint, Window } from "@corebyte/webwindow";
import { env } from "bun";
import getPort from "get-port";
import { PluginShape } from "../../packages/types";
import indexHTML from "./public/index.html";

Window.check();
const port = env.NODE_ENV === "production" ? await getPort() : 3000;

export const id = "plugin-react-frontend";
export const format = 1;
export const name = "React frontend";
export const description =
	"A pretty frontend for CoreLauncher using React and a browserview.";

export class Plugin extends PluginShape implements PluginShape {
	server: Bun.Server;
	window: Window;
	constructor() {
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

		this.emit("ready");
	}
}
