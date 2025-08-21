import { join } from "node:path";
import { PluginPortal as AbstractPluginPortal } from "@corelauncher/types";
import { ensureDirSync } from "fs-extra";
import { pluginDataDirectory } from "../util/directories";
import type PluginContainer from "./PluginContainer";
import type PluginManager from "./PluginManager";

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export default class PluginPortal
	extends AbstractPluginPortal
	implements AbstractPluginPortal
{
	container: PluginContainer;
	pluginManager: PluginManager;
	constructor(container: PluginContainer) {
		super();
		this.container = container;
		this.pluginManager = container.pluginManager;

		this.pluginManager.on("games", (games) => {
			this.emit("games", games);
		});

		this.pluginManager.on("account_providers", (providers) => {
			this.emit("account_providers", providers);
		});

		this.pluginManager.on("ready", () => {
			this.emit("ready");
		});
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

	getAccountProviders() {
		return this.pluginManager.plugins
			.flatMap((plugin) => plugin.accountProviders)
			.filter((provider) => provider);
	}

	getAccountProvider(id: string) {
		const provider = this.pluginManager.plugins
			.flatMap((plugin) => plugin.accountProviders)
			.find((provider) => provider.id === id);

		if (!provider)
			throw new Error(`Account provider with ID ${id} does not exist`);
		return provider;
	}
}
