import { GameInstanceProviderShape } from "@corelauncher/sdk";
import MinecraftGameInstance from "./MinecraftGameInstance";

export default class MinecraftGameInstanceProvider extends GameInstanceProviderShape {
	create() {
		return new MinecraftGameInstance();
	}
}
