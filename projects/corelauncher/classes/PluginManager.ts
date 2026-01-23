import type { PluginExport, PluginShapeEvents } from "@corelauncher/sdk";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import PluginContainer from "./PluginContainer";

interface PluginManagerEvents extends PluginShapeEvents {
	app_instance: (args: string[]) => void;
	protocol_launch: (url: URL) => void;
}

/**
 * Manages plugins for CoreLauncher.
 * Handles loading, enabling, and disabling plugins.
 * Emits events when plugins are ready.
 */
export default class PluginManager extends TypedEmitter<PluginManagerEvents> {
	plugins: PluginContainer[];
	constructor() {
		super();
		this.plugins = [];
	}

	/**
	 * Loads a plugin into the manager.
	 * @param plugin Plugin to load.
	 */
	async loadPlugin(plugin: PluginExport) {
		console.info(`Loading plugin "${plugin.name}" (${plugin.id})...`);

		const container = new PluginContainer(this, plugin);
		this.plugins.push(container);

		container.on("ready", () => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) loaded successfully.`,
			);
			this.emit("ready");
		});

		container.on("game_providers_updated", () => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered game providers.`,
			);
			this.emit("game_providers_updated");
		});

		container.on("game_instances_updated", () => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered game instances.`,
			);
			this.emit("game_instances_updated");
		});

		container.on("game_profiles_updated", () => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered game profiles.`,
			);
			this.emit("game_profiles_updated");
		});

		container.on("account_providers_updated", () => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered account providers.`,
			);
			this.emit("account_providers_updated");
		});

		container.on("account_instances_updated", () => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered account instances.`,
			);
			this.emit("account_instances_updated");
		});
	}

	// async enablePlugin(id: string) {}

	// async disablePlugin(id: string) {}

	propagateAppInstance(args: string[]) {
		this.emit("app_instance", args);
	}

	propagateProtocolLaunch(url: string) {
		this.emit("protocol_launch", new URL(url));
	}

	getGameProviders() {
		return this.plugins.flatMap((plugin) => plugin.accountProviders);
	}

	getGameProvider(id: string) {
		return this.getGameProviders().find((provider) => provider.id === id);
	}

	getGameInstances() {
		return this.plugins.flatMap((plugin) => plugin.gameInstances);
	}

	getGameInstance(id: string) {
		return this.getGameInstances().find((game) => game.id === id);
	}

	getGameProfiles() {
		return this.plugins.flatMap((plugin) => plugin.gameProfiles);
	}

	getGameProfile(id: string) {
		return this.getGameProfiles().find((profile) => profile.id === id);
	}

	getAccountProviders() {
		return this.plugins.flatMap((plugin) => plugin.accountProviders);
	}

	getAccountProvider(id: string) {
		return this.getAccountProviders().find((provider) => provider.id === id);
	}

	getAccountInstances() {
		return this.plugins.flatMap((plugin) => plugin.accountInstances);
	}

	getAccountInstance(id: string) {
		return this.getAccountInstances().find((instance) => instance.id === id);
	}
}
