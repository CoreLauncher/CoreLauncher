import { TypedEmitter } from "@corelauncher/typed-emitter";
import type {
	GameShape,
	GameState,
	PluginExport,
	PluginShapeEvents,
} from "@corelauncher/types";
import PluginContainer from "./PluginContainer";

interface PluginManagerEvents extends PluginShapeEvents {
	app_instance: (args: string[]) => void;
	protocol_launch: (url: URL) => void;
	game_state_changed: (
		game: InstanceType<typeof GameShape>,
		newState: GameState,
		oldState: GameState,
	) => void;
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

		container.on("games", (games) => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered ${games.length} games.`,
			);
			this.emit("games", games);
		});

		container.on("game_state_changed", (game, newState, oldState) => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) reported state change "${oldState}" > "${newState}" for game "${game.name}" (${game.id}).`,
			);
			this.emit("game_state_changed", game, newState, oldState);
		});

		container.on("account_providers", (providers) => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered ${providers.length} account providers.`,
			);
			this.emit("account_providers", providers);
		});

		container.on("account_instances", (instances) => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) registered ${instances.length} account instances.`,
			);
			this.emit("account_instances", instances);
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
}
