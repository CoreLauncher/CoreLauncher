import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import { type PluginPortal, PluginShape } from "@corelauncher/types";
import { migrations } from "./migrations";
import MinecraftAccountProvider from "./parts/MinecraftAccountProvider";
import MinecraftGame from "./parts/MinecraftGame";
import type { Database } from "./types/database";

async function noop() {}

export const id = "plugin-minecraft";
export const format = 1;
export const name = "Minecraft";
export const description = "Allows you to launch Minecraft from CoreLauncher.";

export class Plugin extends PluginShape {
	constructor(portal: PluginPortal) {
		super(portal);

		noop().then(async () => {
			const database = await createDatabase<Database>(
				join(portal.getDataDirectory(), "database.sqlite"),
				migrations,
			);

			const accountProvider = new MinecraftAccountProvider(database);

			portal.on("protocol_launch", (url) => {
				const code = url.searchParams.get("code");
				if (url.host !== "plugin") return;
				if (url.pathname !== "/minecraft/login_callback") return;
				if (code === null) return;

				console.log(url);
				accountProvider.handleCode(code);
			});

			accountProvider.on("instances_updated", (instances) => {
				this.emit("account_instances", instances);
			});

			this.emit("games", [new MinecraftGame()]);
			this.emit("account_providers", [accountProvider]);
			this.emit("ready");
		});
	}
}
