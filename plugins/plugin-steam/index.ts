import {
	PluginClass,
	type PluginPortal,
	type PluginShape,
} from "@corelauncher/types";
import SteamGame from "./parts/SteamGame";
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

		noop()
			.then(async () => {
				const games = await getSteamGames();
				this.emit(
					"games",
					games
						.map(
							(game) => new SteamGame(`steam:${game.id.toString()}`, game.name),
						)
						.filter((game) => game.id !== "steam:228980"),
				);
			})
			.then(() => {
				this.emit("ready");
			});
			
	}
}
