import PluginManager from "./PluginManager";

export default class CoreLauncher {
	plugins: PluginManager;
	constructor() {
		this.plugins = new PluginManager();
	}
}
