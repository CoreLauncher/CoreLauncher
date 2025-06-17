import { PluginShape } from "@corelauncher/types";
import { getSteamGames } from "./util/steam";
import SteamGame from "./parts/SteamGame";

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

		noop()
			.then(async () => {
				console.log(await getSteamGames());
				const games = await getSteamGames();
				this.emit(
					"games",
					games.map((game) => new SteamGame(game.id.toString(), game.name)),
				);
			})
			.then(() => {
				this.emit("ready");
			});
	}
}
