import { SizeConstraint, Window } from "@corebyte/webwindow";
import type { PluginShape } from "../../packages/types";

Window.check();

export const id = "plugin-react-frontend";
export const name = "React frontend";
export const description =
	"A pretty frontend for CoreLauncher using React and a browserview.";

export class Plugin implements PluginShape {
	window: Window;
	constructor() {
		const windowOptions = {
			title: "CoreLauncher",
			url: "https://example.com",
			size: {
				width: 800,
				height: 600,
				constraint: SizeConstraint.MIN,
			},
		} as ConstructorParameters<typeof Window>[0];

		this.window = new Window(windowOptions);
	}
}
