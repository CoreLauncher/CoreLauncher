import { GameInstanceProviderShape } from "@corelauncher/types";
import MinecraftGameInstance from "./MinecraftGameInstance";

export default class MinecraftGameInstanceProvider extends GameInstanceProviderShape {
	create() {
		return new MinecraftGameInstance();
	}
}
