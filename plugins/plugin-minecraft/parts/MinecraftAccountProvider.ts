import { readFileSync } from "node:fs";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { AccountProviderShape } from "@corelauncher/types";
import { live } from "@xboxreplay/xboxlive-auth";
import logoSVG from "../assets/minecraft.svg";

export default class MinecraftAccountProvider extends AccountProviderShape {
	id = "minecraft";
	name = "Minecraft";
	color = "#52a535";
	logoUrl = dataToDataURL(readFileSync(logoSVG, "utf-8"), "image/svg+xml");

	// constructor() {
	// 	super();
	// }

	connect() {
		console.log("Connecting to Minecraft account provider...");

		const authorizeUrl = live.getAuthorizeUrl(
			"54e48db0-6129-4320-82a7-3b0156811a91",
			"XboxLive.signin XboxLive.offline_access",
			"code",
			"corelauncher://plugin/minecraft/login_callback",
		);

		console.log("Authorize URL:", `${authorizeUrl}&prompt=select_account`);
		return true;
	}
}
