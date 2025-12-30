import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import * as EpicPlugin from "@corelauncher/plugin-epic-games";
import * as MinecraftPlugin from "@corelauncher/plugin-minecraft";
import * as ReactPlugin from "@corelauncher/plugin-react-frontend";
import * as SteamPlugin from "@corelauncher/plugin-steam";
import type { Kysely } from "kysely";
import type { Database } from "../types/database";
import { applicationDirectory } from "../util/directories";
import PluginManager from "./PluginManager";
import SingleInstanceLock from "./SingleInstanceLock";

/**
 * CoreLauncher class that initializes and manages plugins.
 */
export default class CoreLauncher {
	database: Promise<Kysely<Database>>;

	singleInstanceLock: SingleInstanceLock;
	plugins: PluginManager;
	constructor() {
		this.singleInstanceLock = new SingleInstanceLock();
		this.plugins = new PluginManager();

		this.database = createDatabase<Database>(
			join(applicationDirectory(), "corelauncher.sqlite"),
			[],
		);

		this.plugins.loadPlugin(EpicPlugin);
		this.plugins.loadPlugin(MinecraftPlugin);
		this.plugins.loadPlugin(ReactPlugin);
		this.plugins.loadPlugin(SteamPlugin);

		this.singleInstanceLock.on("instance", (args) => {
			if (args[0] === "protocol" && args[1])
				return this.plugins.propagateProtocolLaunch(args[1]);

			this.plugins.propagateAppInstance(args);
		});
	}
}
