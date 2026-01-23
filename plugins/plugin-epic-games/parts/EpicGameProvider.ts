import { GameProviderShape } from "@corelauncher/sdk/shapes/GameProviderShape";
import { tasklist } from "tasklist";
import { getEpicGames } from "../util/epic";
import EpicGameInstance from "./EpicGameInstance";

interface EpicGameProviderEvents {
	game_instances_updated: (instances: EpicGameInstance[]) => void;
	game_state_changed: () => void;
}

export class EpicGameProvider extends GameProviderShape<EpicGameProviderEvents> {
	id = "epic-games";
	name = "Epic Games";

	constructor() {
		super();

		Promise.resolve().then(async () => {
			const gamesList = await getEpicGames();
			const games = gamesList.map(
				(game) =>
					new EpicGameInstance({
						id: game.id,
						name: game.name,
						processes: game.processes,
					}),
			);

			this.emit("game_instances_updated", games);

			setInterval(async () => {
				let changed = false;
				const tasks = await tasklist();
				const executables = tasks.map((task) => task.imageName);
				games.forEach((game) => {
					changed = changed || game.updateState(executables);
				});
				if (changed) this.emit("game_state_changed");
			}, 5000);
		});
	}
}
