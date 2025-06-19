import type PluginManager from "./PluginManager";

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export default class PluginPortal {
	private pluginManager: PluginManager;
	constructor(pluginManager: PluginManager) {
		this.pluginManager = pluginManager;
	}
}
