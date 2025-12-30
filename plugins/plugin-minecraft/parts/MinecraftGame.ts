import { GameShape, GameState } from "@corelauncher/types";

export default class MinecraftGame extends GameShape {
	id = "minecraft:minecraft_java";
	name = "Minecraft Java Edition";
	state = GameState.Unknown;
	iconUrl = null;
	bannerUrl = null;
	capsuleUrl = null;

	// constructor() {
	// 	super();
	// }

	async launch() {
		console.log("Launching Minecraft Java Edition...");
		return true;
	}
}
