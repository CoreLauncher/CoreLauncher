import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import { type PluginPortal, PluginShape } from "@corelauncher/sdk";
import { migrations } from "./migrations";
import type MinecraftAccountInstance from "./parts/MinecraftAccountInstance";
import MinecraftAccountProvider from "./parts/MinecraftAccountProvider";
import MinecraftGameInstance from "./parts/MinecraftGameInstance";
import type MinecraftGameProfile from "./parts/MinecraftGameProfile";
import { MinecraftGameProvider } from "./parts/MinecraftGameProvider";
import type { Database } from "./types/database";

async function noop() {}

export const id = "plugin-minecraft";
export const format = 1;
export const name = "Minecraft";
export const description = "Allows you to launch Minecraft from CoreLauncher.";

export class Plugin extends PluginShape {
	gameProviders: MinecraftGameProvider[] = [];
	gameInstances: MinecraftGameInstance[] = [];
	gameProfiles: MinecraftGameProfile[] = [];
	accountProviders: MinecraftAccountProvider[] = [];
	accountInstances: MinecraftAccountInstance[] = [];

	constructor(portal: PluginPortal) {
		super(portal);

		noop().then(async () => {
			const database = await createDatabase<Database>(
				join(portal.getDataDirectory(), "database.sqlite"),
				migrations,
			);

			const gameProvider = new MinecraftGameProvider();
			this.gameProviders = [gameProvider];
			this.emit("game_providers_updated");

			const gameInstance = new MinecraftGameInstance();
			this.gameInstances = [gameInstance];
			this.emit("game_instances_updated");

			gameInstance.on("game_profiles_updated", (profiles) => {
				this.gameProfiles = profiles;
				this.emit("game_profiles_updated");
			});

			const accountProvider = new MinecraftAccountProvider(database);
			this.accountProviders = [accountProvider];
			this.emit("account_providers_updated");

			portal.on("protocol_launch", (url) => {
				const code = url.searchParams.get("code");
				if (url.host !== "plugin") return;
				if (url.pathname !== "/minecraft/login_callback") return;
				if (code === null) return;

				console.log(url);
				accountProvider.handleCode(code);
			});

			accountProvider.on("account_instances_updated", (instances) => {
				this.accountInstances = instances;
				this.emit("account_instances_updated");
			});

			this.emit("ready");
		});
	}
}
