import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import { type PluginPortal, PluginShape } from "@corelauncher/sdk";
import { migrations } from "./migrations";
import SteamAccountInstance from "./parts/SteamAccountInstance";
import { SteamAccountProvider } from "./parts/SteamAccountProvider";
import type { Database } from "./types/database";

async function noop() {}

export const id = "plugin-steam";
export const format = 1;
export const name = "Steam";
export const description =
	"Allows you to launch Steam games from CoreLauncher.";

export class Plugin extends PluginShape {
	constructor(portal: PluginPortal) {
		super(portal);

		noop().then(async () => {
			const database = await createDatabase<Database>(
				join(portal.getDataDirectory(), "database.sqlite"),
				migrations,
			);

			// #region Accounts
			// Load stored account instances
			const accountInstances: SteamAccountInstance[] = await database
				.selectFrom("accounts")
				.selectAll()
				.execute()
				.then((instances) => instances.map((i) => new SteamAccountInstance(i)));

			// Create account provider and listen for new instances
			const accountProvider = new SteamAccountProvider(portal, database);
			accountProvider.on("connection", async (data) => {
				if (accountInstances.find((a) => a.name === data.name)) return;
				accountInstances.push(new SteamAccountInstance(data));
				this.emit("account_instances", accountInstances);
			});
			// #endregion

			for (const instance of accountInstances) {
				instance.on("games", () => {
					this.emit("games", instance.games);
				});
			}

			this.emit("account_instances", accountInstances);
			this.emit("account_providers", [accountProvider]);
			this.emit("ready");
		});
	}
}
