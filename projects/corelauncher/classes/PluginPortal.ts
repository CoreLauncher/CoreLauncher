import { join } from "node:path";
import type { ShowDialogOptions } from "@corelauncher/sdk";
import { PluginPortal as AbstractPluginPortal } from "@corelauncher/sdk";
import { ensureDirSync } from "fs-extra";
import { pluginDataDirectory } from "../util/directories";
import type PluginContainer from "./PluginContainer";
import type PluginManager from "./PluginManager";

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export default class PluginPortal extends AbstractPluginPortal {
	container: PluginContainer;
	pluginManager: PluginManager;
	constructor(container: PluginContainer) {
		super();
		this.container = container;
		this.pluginManager = container.pluginManager;

		this.pluginManager.on("ready", () => {
			this.emit("ready");
		});

		this.pluginManager.on("game_providers_updated", () => {
			this.emit("game_providers_updated");
		});

		this.pluginManager.on("game_instances_updated", () => {
			this.emit("game_instances_updated");
		});

		this.pluginManager.on("account_providers_updated", () => {
			this.emit("account_providers_updated");
		});

		this.pluginManager.on("account_instances_updated", () => {
			this.emit("account_instances_updated");
		});

		this.pluginManager.on("app_instance", (args) => {
			this.emit("app_instance", args);
		});

		this.pluginManager.on("protocol_launch", (url) => {
			this.emit("protocol_launch", url);
		});
	}

	get arguments() {
		return Bun.argv.slice(2);
	}

	getDataDirectory() {
		const directory = join(pluginDataDirectory(), this.container.id);
		ensureDirSync(directory);
		return directory;
	}

	getGameProviders() {
		return this.pluginManager.getGameProviders();
	}

	getGameProvider(id: string) {
		const provider = this.pluginManager.getGameProvider(id);
		if (!provider) throw new Error(`Game provider with id "${id}" not found.`);
		return provider;
	}

	getGameInstances() {
		return this.pluginManager.getGameInstances();
	}

	getGameInstance(id: string) {
		const instance = this.pluginManager.getGameInstance(id);
		if (!instance) throw new Error(`Game instance with id "${id}" not found.`);
		return instance;
	}

	getGameProfiles() {
		return this.pluginManager.getGameProfiles();
	}

	getGameProfile(id: string) {
		const profile = this.pluginManager.getGameProfile(id);
		if (!profile) throw new Error(`Game profile with id "${id}" not found.`);
		return profile;
	}

	getAccountProviders() {
		return this.pluginManager.getAccountProviders();
	}

	getAccountProvider(id: string) {
		const provider = this.pluginManager.getAccountProvider(id);
		if (!provider)
			throw new Error(`Account provider with id "${id}" not found.`);
		return provider;
	}

	getAccountInstances() {
		return this.pluginManager.getAccountInstances();
	}

	getAccountInstance(id: string) {
		const instance = this.pluginManager.getAccountInstance(id);
		if (!instance)
			throw new Error(`Account instance with id "${id}" not found.`);
		return instance;
	}

	showDialog(options: ShowDialogOptions) {
		this.container.pluginManager.plugins.forEach((plugin) => {
			plugin.portal.emit("show_dialog_request", options);
		});
	}

	closeDialog(options: { id: string }) {
		this.container.pluginManager.plugins.forEach((plugin) => {
			plugin.portal.emit("close_dialog_request", options);
		});
	}

	exit() {
		process.exit(0);
	}
}
