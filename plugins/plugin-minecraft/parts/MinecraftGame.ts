import { GameShape, GameState, GameType } from "@corelauncher/types";
import { MinecraftInstanceProvider } from "./MinecraftInstanceProvider";

export default class MinecraftGame extends GameShape {
	id = "minecraft:minecraft_java";
	name = "Minecraft Java Edition";
	type = GameType.Instanced;
	state = GameState.Unknown;
	iconUrl = null;
	bannerUrl = null;
	capsuleUrl = null;

	constructor() {
		super();

		this.instanceProvider = new MinecraftInstanceProvider();
	}

	async launch() {
		console.log("Launching Minecraft Java Edition...");
		return true;
	}
}
