import { SizeConstraint, Window } from "@corebyte/webwindow";
import getPort from "get-port";
import { PluginShape } from "../../packages/types";
import indexHTML from "./public/index.html";
import { env } from "bun";

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

		console.log(`Starting internal server on http://localhost:${port}`);

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
		this.window.on("close", () => {
			this.server.stop();
		});

		this.emit("ready");
	}
}
