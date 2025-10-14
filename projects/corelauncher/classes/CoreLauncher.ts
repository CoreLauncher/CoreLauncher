import * as EpicPlugin from "@corelauncher/plugin-epic-games";
import * as ReactPlugin from "@corelauncher/plugin-react-frontend";
import * as SteamPlugin from "@corelauncher/plugin-steam";

import PluginManager from "./PluginManager";
import SingleInstanceLock from "./SingleInstanceLock";

/**
 * CoreLauncher class that initializes and manages plugins.
 */
export default class CoreLauncher {
	singleInstanceLock: SingleInstanceLock;
	plugins: PluginManager;
	constructor() {
		this.singleInstanceLock = new SingleInstanceLock();
		this.plugins = new PluginManager();

		this.plugins.loadPlugin(ReactPlugin);
		this.plugins.loadPlugin(SteamPlugin);
		this.plugins.loadPlugin(EpicPlugin);
	}
}
