import type { PluginPortal as AbstractPluginPortal } from "@corelauncher/types";
import type PluginManager from "./PluginManager";

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export default class PluginPortal implements AbstractPluginPortal {
	private pluginManager: PluginManager;
	constructor(pluginManager: PluginManager) {
		this.pluginManager = pluginManager;
	}

	getGames() {
		return this.pluginManager.plugins.flatMap((plugin) => plugin.parts.games);
	}

	getGame(id: string) {
		const game = this.pluginManager.plugins
			.flatMap((plugin) => plugin.parts.games)
			.find((game) => game.id === id);

		if (!game) throw new Error(`Game with ID ${id} does not exist`);
		return game;
	}
}
