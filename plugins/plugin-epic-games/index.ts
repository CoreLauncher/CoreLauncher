import { noop } from "@corelauncher/noop";
import { type PluginPortal, PluginShape } from "@corelauncher/sdk";
import type EpicGameInstance from "./parts/EpicGameInstance.ts";
import { EpicGameProvider } from "./parts/EpicGameProvider.ts";
import { getEpicInstalled } from "./util/registry.ts";

export const id = "plugin-epicgames";
export const format = 1;
export const name = "Epic Games";
export const description = "Allows you to launch Epic Games from CoreLauncher.";

export class Plugin extends PluginShape {
	gameProviders: EpicGameProvider[] = [];
	gameInstances: EpicGameInstance[] = [];
	gameProfiles: never[] = [];
	accountProviders: never[] = [];
	accountInstances: never[] = [];

	constructor(portal: PluginPortal) {
		super(portal);

		noop().then(async () => {
			if (!(await getEpicInstalled())) return this.emit("ready");

			const gameProvider = new EpicGameProvider();
			this.gameProviders = [gameProvider];
			this.emit("game_providers_updated");

			gameProvider.on(
				"game_instances_updated",
				(instances: EpicGameInstance[]) => {
					this.gameInstances = instances;
					this.emit("game_instances_updated");
				},
			);

			gameProvider.on("game_state_changed", () => {
				this.emit("game_instances_updated");
			});

			this.emit("ready");
		});
	}
}
