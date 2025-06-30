import { join } from "node:path";
import type { PluginPortal as AbstractPluginPortal } from "@corelauncher/types";
import { ensureDirSync } from "fs-extra";
import { pluginDataDirectory } from "../util/directories";
import type PluginContainer from "./PluginContainer";
import type PluginManager from "./PluginManager";

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export default class PluginPortal implements AbstractPluginPortal {
	container: PluginContainer;
	pluginManager: PluginManager;
	constructor(container: PluginContainer) {
		this.container = container;
		this.pluginManager = container.pluginManager;
	}

	getDataDirectory() {
		const directory = join(pluginDataDirectory(), this.container.id);
		ensureDirSync(directory);
		return directory;
	}

	getGames() {
		return this.pluginManager.plugins.flatMap((plugin) => plugin.games);
	}

	getGame(id: string) {
		const game = this.pluginManager.plugins
			.flatMap((plugin) => plugin.games)
			.find((game) => game.id === id);

		if (!game) throw new Error(`Game with ID ${id} does not exist`);
		return game;
	}
}
