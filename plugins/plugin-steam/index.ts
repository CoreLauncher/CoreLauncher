import { PluginClass, type PluginShape } from "@corelauncher/types";
import { SteamAccountProvider } from "./parts/SteamAccountProvider";
import SteamGame from "./parts/SteamGame";
import { getSteamGames } from "./util/steam";

async function noop() {}

export const id = "plugin-steam";
export const format = 1;
export const name = "Steam";
export const description =
	"Allows you to launch Steam games from CoreLauncher.";

export class Plugin extends PluginClass implements PluginShape {
	constructor() {
		super();

		noop().then(async () => {
			const games = await getSteamGames();
			this.emit(
				"games",
				games
					.map((game) => new SteamGame({ id: game.id, name: game.name }))
					.filter((game) => game.id !== "steam:228980"), // Steam Common Redistibutables
			);

			this.emit("account_providers", [new SteamAccountProvider()]);
			this.emit("ready");
		});
	}
}
