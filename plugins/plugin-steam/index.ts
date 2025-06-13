import type { PluginShape } from "@corelauncher/types";

export const id = "plugin-steam";
export const format = 1;
export const name = "Steam";
export const description =
	"Allows you to launch Steam games from CoreLauncher.";

export class Plugin implements PluginShape {
	constructor() {}
}
