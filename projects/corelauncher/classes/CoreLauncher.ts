import * as EpicPlugin from "@corelauncher/plugin-epic-games";
import * as ReactPlugin from "@corelauncher/plugin-react-frontend";
import * as SteamPlugin from "@corelauncher/plugin-steam";

import PluginManager from "./PluginManager";

/**
 * CoreLauncher class that initializes and manages plugins.
 */
export default class CoreLauncher {
	plugins: PluginManager;
	constructor() {
		this.plugins = new PluginManager();

		this.plugins.loadPlugin(ReactPlugin);
		this.plugins.loadPlugin(SteamPlugin);
		this.plugins.loadPlugin(EpicPlugin);
	}
}
