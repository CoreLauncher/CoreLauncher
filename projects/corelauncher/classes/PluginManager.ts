import { TypedEmitter } from "tiny-typed-emitter";
import type { GameShape, PluginShape } from "@corelauncher/types";
import PluginPortal from "./PluginPortal";

type Plugin = {
	id: string;
	name: string;
	description: string;
	Plugin: new (
		...args: ConstructorParameters<typeof PluginShape>
	) => PluginShape;
};

type LoadedPlugin = Plugin & {
	constructed?: InstanceType<typeof PluginShape>;
	ready: boolean;
	parts: {
		games: InstanceType<typeof GameShape>[];
	};
};

interface PluginManagerEvents {
	"plugin-ready": (plugin: LoadedPlugin) => void;
}

/**
 * Manages plugins for CoreLauncher.
 * Handles loading, enabling, and disabling plugins.
 * Emits events when plugins are ready.
 */
export default class PluginManager extends TypedEmitter<PluginManagerEvents> {
	private portal: PluginPortal;
	plugins: LoadedPlugin[];
	constructor() {
		super();
		this.portal = new PluginPortal(this);
		this.plugins = [];
	}

	/**
	 * Loads a plugin into the manager.
	 * @param plugin Plugin to load.
	 */
	async loadPlugin(plugin: Plugin) {
		console.info(`Loading plugin "${plugin.name}" (${plugin.id})...`);
		const constructed = new plugin.Plugin(this.portal);
		const loaded = {
			...plugin,
			constructed: constructed,
			ready: false,
			parts: {
				games: [],
			},
		} as LoadedPlugin;

		constructed.on("games", (games: InstanceType<typeof GameShape>[]) => {
			if (loaded.ready)
				throw new Error(
					"Can't update games after ready event has been emitted.",
				);
			loaded.parts.games = games;
		});

		constructed.on("ready", () => {
			console.info(
				`Plugin "${plugin.name}" (${plugin.id}) loaded successfully.`,
			);
			loaded.ready = true;
			this.emit("plugin-ready", loaded);
		});

		this.plugins.push(loaded);
	}

	async enablePlugin(id: string) {}

	async disablePlugin(id: string) {}
}
