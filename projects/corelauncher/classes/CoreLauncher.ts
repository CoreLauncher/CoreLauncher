import PluginManager from "./PluginManager";
import * as ReactPlugin from "@corelauncher/plugin-react-frontend";

export default class CoreLauncher {
	plugins: PluginManager;
	constructor() {
		this.plugins = new PluginManager();

		this.plugins.loadPlugin(ReactPlugin);
	}
}
