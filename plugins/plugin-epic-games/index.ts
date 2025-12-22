import { type PluginPortal, PluginShape } from "@corelauncher/types";
import { tasklist } from "tasklist";
import EpicGame from "./parts/EpicGame.ts";
import { getEpicGames } from "./util/epic";
import { getEpicInstalled } from "./util/registry.ts";

async function noop() {}

export const id = "plugin-epicgames";
export const format = 1;
export const name = "Epic Games";
export const description = "Allows you to launch Epic Games from CoreLauncher.";

export class Plugin extends PluginShape {
	constructor(portal: PluginPortal) {
		super(portal);

		noop().then(async () => {
			if (!(await getEpicInstalled())) return this.emit("ready");

			const gamesList = await getEpicGames();
			const games = gamesList.map(
				(game) =>
					new EpicGame({
						id: game.id,
						name: game.name,
						processes: game.processes,
					}),
			);

			this.emit("games", games);

			setInterval(async () => {
				const tasks = await tasklist();
				const executables = tasks.map((task) => task.imageName);
				games.forEach((game) => {
					game.updateState(executables);
				});
			}, 5000);

			this.emit("ready");
		});
	}
}
