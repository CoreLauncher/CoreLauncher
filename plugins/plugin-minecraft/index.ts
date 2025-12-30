import { type PluginPortal, PluginShape } from "@corelauncher/types";
import MinecraftAccountProvider from "./parts/MinecraftAccountProvider";

async function noop() {}

export const id = "plugin-minecraft";
export const format = 1;
export const name = "Minecraft";
export const description = "Allows you to launch Minecraft from CoreLauncher.";

export class Plugin extends PluginShape {
	constructor(portal: PluginPortal) {
		super(portal);

		noop().then(async () => {
			const accountProvider = new MinecraftAccountProvider();

			// portal.on("protocol_launch", (url) => {});

			// this.emit("account_instances", accountInstances);
			this.emit("account_providers", [accountProvider]);
			this.emit("ready");
		});
	}
}
