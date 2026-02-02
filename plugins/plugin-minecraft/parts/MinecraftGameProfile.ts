import { join } from "node:path";
import { GameProfileShape } from "@corelauncher/sdk";
import type { Selectable } from "kysely";
import type { MinecraftPlugin } from "..";
import type { Database } from "../types/database";

export default class MinecraftGameProfile extends GameProfileShape {
	game = "minecraft:minecraft_java";

	private plugin: MinecraftPlugin;
	private data: Selectable<Database["profiles"]>;
	constructor(plugin: MinecraftPlugin, data: Selectable<Database["profiles"]>) {
		super();

		this.plugin = plugin;
		this.data = data;
	}

	get id() {
		return this.data.id.toString();
	}

	get name() {
		return this.data.name;
	}

	get subname() {
		return `Minecraft ${this.data.loaderType} ${this.data.gameVersion}`;
	}

	async launch() {
		this.plugin.launchMinecraft(
			join(
				this.plugin.portal.getDataDirectory(),
				"instances",
				this.data.id.toString(),
			),
			{
				game: this.data.gameVersion,
				loader: this.data.loaderVersion,
				type: this.data.loaderType,
			},
		);
		console.log(`Launching Minecraft profile ${this.name}`);
		return true;
	}
}
