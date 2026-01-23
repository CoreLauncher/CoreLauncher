import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import {
	BulkListener,
	type PluginPortal,
	PluginShape,
} from "@corelauncher/sdk";
import { migrations } from "./migrations";
import type SteamAccountInstance from "./parts/SteamAccountInstance";
import { SteamAccountProvider } from "./parts/SteamAccountProvider";
import type SteamGameInstance from "./parts/SteamGameInstance";
import { SteamGameProvider } from "./parts/SteamGameProvider";
import type { Database } from "./types/database";

async function noop() {}

export const id = "plugin-steam";
export const format = 1;
export const name = "Steam";
export const description =
	"Allows you to launch Steam games from CoreLauncher.";

export class Plugin extends PluginShape {
	gameProviders: SteamGameProvider[] = [];
	gameInstances: SteamGameInstance[] = [];
	gameProfiles: never[] = [];
	accountProviders: SteamAccountProvider[] = [];
	accountInstances: SteamAccountInstance[] = [];

	constructor(portal: PluginPortal) {
		super(portal);

		noop().then(async () => {
			const database = await createDatabase<Database>(
				join(portal.getDataDirectory(), "database.sqlite"),
				migrations,
			);

			const statelistener = new BulkListener("state_changed", () => {
				this.emit("game_instances_updated");
			});

			const gameProvider = new SteamGameProvider();
			this.gameProviders = [gameProvider];
			this.emit("game_providers_updated");

			gameProvider.on(
				"game_instances_updated",
				(instances: SteamGameInstance[]) => {
					this.gameInstances = instances;
					this.emit("game_instances_updated");
					statelistener.listen(instances);
				},
			);

			const accountProvider = new SteamAccountProvider(portal, database);
			this.accountProviders = [accountProvider];
			this.emit("account_providers_updated");

			accountProvider.on("account_instances_updated", (instances) => {
				this.accountInstances = instances;
				this.emit("account_instances_updated");
				gameProvider.registerAccounts(instances);
			});

			this.emit("ready");
		});
	}
}
