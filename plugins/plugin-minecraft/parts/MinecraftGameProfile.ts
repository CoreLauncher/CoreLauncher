import { GameProfileShape } from "@corelauncher/sdk";
import type { Selectable } from "kysely";
import type { Database } from "../types/database";

export default class MinecraftGameProfile extends GameProfileShape {
	game = "minecraft:minecraft_java";

	private data: Selectable<Database["profiles"]>;
	constructor(data: Selectable<Database["profiles"]>) {
		super();

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

	launch() {
		console.log(`Launching Minecraft profile ${this.name}`);
		return true;
	}
}
