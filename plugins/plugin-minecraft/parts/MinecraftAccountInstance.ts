import { AccountInstanceShape } from "@corelauncher/types";

export default class MinecraftAccountInstance extends AccountInstanceShape {
	providerId = "steam";

	// CHANGE TO USER ID!!!
	id = "minecraft:minecraft_java";
	name = "Minecraft Java Edition";

	// constructor() {
	// 	super();
	// }

	static async fromCode(_code: string) {}
}
