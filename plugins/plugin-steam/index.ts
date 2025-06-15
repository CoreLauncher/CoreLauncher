import { PluginShape } from "@corelauncher/types";
import { getSteamInstallationDirectory } from "./util/registry";

async function noop() {}

export const id = "plugin-steam";
export const format = 1;
export const name = "Steam";
export const description =
	"Allows you to launch Steam games from CoreLauncher.";

export class Plugin extends PluginShape implements PluginShape {
	constructor() {
		super();

		// this.steamDirectory =
		// console.log(this.steamDirectory);

		noop().then(async () => {
			console.log(await getSteamInstallationDirectory());
		});
	}
}
