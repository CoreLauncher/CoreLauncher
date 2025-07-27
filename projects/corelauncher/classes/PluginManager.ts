import type { PluginExport } from "@corelauncher/types";
import { TypedEmitter } from "tiny-typed-emitter";
import PluginContainer from "./PluginContainer";

interface PluginManagerEvents {
	"plugin-ready": (plugin: PluginContainer) => void;
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
			this.emit("plugin-ready", container);
		});
	}

	// async enablePlugin(id: string) {}

	// async disablePlugin(id: string) {}
}
