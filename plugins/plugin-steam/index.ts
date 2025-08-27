import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import {
	PluginClass,
	type PluginPortal,
	type PluginShape,
} from "@corelauncher/types";
import { migrations } from "./migrations";
import SteamAccountInstance from "./parts/SteamAccountInstance";
import { SteamAccountProvider } from "./parts/SteamAccountProvider";
import SteamGame from "./parts/SteamGame";
import type { Database } from "./types/database";
import { getSteamGames } from "./util/steam";

async function noop() {}

export const id = "plugin-steam";
export const format = 1;
export const name = "Steam";
export const description =
	"Allows you to launch Steam games from CoreLauncher.";

export class Plugin extends PluginClass implements PluginShape {
	constructor(portal: PluginPortal) {
		super();

		noop().then(async () => {
			const database = await createDatabase<Database>(
				join(portal.getDataDirectory(), "database.sqlite"),
				migrations,
			);

			// #region Accounts
			const attatchListeners = (instance: SteamAccountInstance) => {
				instance.on("refreshToken", async (token) => {
					await database
						.updateTable("accounts")
						.set({ refreshToken: token })
						.where("name", "=", instance.name)
						.execute();
				});
			};

			// Load stored account instances
			const accountInstances: SteamAccountInstance[] = await database
				.selectFrom("accounts")
				.selectAll()
				.execute()
				.then((instances) => instances.map((i) => new SteamAccountInstance(i)));

			accountInstances.forEach(attatchListeners);

			// Create account provider and listen for new instances
			const accountProvider = new SteamAccountProvider(database);
			accountProvider.on("connection", async (data) => {
				const accountInstance = new SteamAccountInstance(data);
				attatchListeners(accountInstance);
				accountInstances.push(accountInstance);
				this.emit("account_instances", accountInstances);
			});
			// #endregion

			const games = await getSteamGames();
			this.emit(
				"games",
				games
					.map((game) => new SteamGame({ id: game.id, name: game.name }))
					.filter((game) => game.id !== "steam:228980"), // Steam Common Redistibutables
			);

			this.emit("account_instances", accountInstances);
			this.emit("account_providers", [accountProvider]);
			this.emit("ready");
		});
	}
}
