import * as ReactPlugin from "@corelauncher/plugin-react-frontend";
import PluginManager from "./PluginManager";

export default class CoreLauncher {
	plugins: PluginManager;
	constructor() {
		this.plugins = new PluginManager();

		this.plugins.loadPlugin(ReactPlugin);
	}
}
