import { PluginClass, type PluginShape } from "@corelauncher/types";
import EpicGame from "./parts/EpicGame.ts";
import { getEpicGames } from "./util/epic";

async function noop() {}

export const id = "plugin-epicgames";
export const format = 1;
export const name = "Epic Games";
export const description = "Allows you to launch Epic Games from CoreLauncher.";

export class Plugin extends PluginClass implements PluginShape {
	constructor() {
		super();

		noop().then(async () => {
			if (!(await getEpicGames())) return this.emit("ready");

			const games = await getEpicGames();
			this.emit(
				"games",
				games.map((game) => new EpicGame({ id: game.id, name: game.name })),
			);

			this.emit("ready");
		});
	}
}
