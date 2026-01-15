import { readFileSync } from "node:fs";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { GameShape, GameState, GameType } from "@corelauncher/types";
import capsuleSVG from "../assets/minecraft-game-capsule.svg";
import logoSVG from "../assets/minecraft-game-logo.svg";
import MinecraftGameInstanceProvider from "./MinecraftGameInstanceProvider";

const iconUrl = dataToDataURL(readFileSync(logoSVG, "utf-8"), "image/svg+xml");
const capsuleUrl = dataToDataURL(
	readFileSync(capsuleSVG, "utf-8"),
	"image/svg+xml",
);

export default class MinecraftGame extends GameShape {
	id = "minecraft:minecraft_java";
	name = "Minecraft Java Edition";
	type = GameType.Instanced;
	state = GameState.Installed;
	iconUrl = iconUrl;
	bannerUrl = null;
	capsuleUrl = capsuleUrl;

	constructor() {
		super();

		this.instanceProvider = new MinecraftGameInstanceProvider();
	}

	async launch() {
		console.log("Launching Minecraft Java Edition...");
		return true;
	}
}
