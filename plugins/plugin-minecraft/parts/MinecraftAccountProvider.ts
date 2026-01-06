import { readFileSync } from "node:fs";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { AccountProviderShape } from "@corelauncher/types";
import { live, xnet } from "@xboxreplay/xboxlive-auth";
import open from "open";
import logoSVG from "../assets/minecraft.svg";
import type MinecraftAccountInstance from "./MinecraftAccountInstance";

const CLIENT_ID = "54e48db0-6129-4320-82a7-3b0156811a91";
const SCOPE = ["XboxLive.signin", "XboxLive.offline_access"];
const REDIRECT_URI = "corelauncher://plugin/minecraft/login_callback";
const MINECRAFT_LOGIN_URL =
	"https://api.minecraftservices.com/authentication/login_with_xbox";

interface MinecraftAccountProviderEvents {
	instances_updated: (instances: MinecraftAccountInstance[]) => void;
}

export default class MinecraftAccountProvider extends AccountProviderShape<MinecraftAccountProviderEvents> {
	id = "minecraft";
	name = "Minecraft";
	color = "#52a535";
	logoUrl = dataToDataURL(readFileSync(logoSVG, "utf-8"), "image/svg+xml");

	private instances: MinecraftAccountInstance[];

	constructor() {
		super();

		this.instances = [];
	}

	async handleCode(code: string) {
		const liveResult = await live.exchangeCodeForAccessToken(
			code,
			CLIENT_ID,
			SCOPE.join(" "),
			REDIRECT_URI,
		);

		console.log("Access Token Result:", liveResult);

		const xboxLiveResult = await xnet.exchangeRpsTicketForUserToken(
			liveResult.access_token,
			"d",
		);

		console.log("XBOX Live Token Result:", xboxLiveResult);

		const xboxSecureResult = await xnet.exchangeTokenForXSTSToken(
			xboxLiveResult.Token,
			{
				XSTSRelyingParty: "rp://api.minecraftservices.com/",
				sandboxId: "RETAIL",
			},
		);

		console.log("XBOX Secure Token Result:", xboxSecureResult);

		const minecraftResponse = await fetch(MINECRAFT_LOGIN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				identityToken: `XBL3.0 x=${xboxSecureResult.DisplayClaims.xui[0]!.uhs};${xboxSecureResult.Token}`,
			}),
		});

		const minecraftResult = await minecraftResponse.json();

		console.log("Minecraft Login Result:", minecraftResult);
	}

	async connect() {
		console.log("Connecting to Minecraft account provider...");

		console.log(await live.preAuth());

		const authorizeUrl = live.getAuthorizeUrl(
			CLIENT_ID,
			SCOPE.join(" "),
			"code",
			REDIRECT_URI,
		);

		console.log("Authorize URL:", `${authorizeUrl}&prompt=select_account`);
		open(authorizeUrl);
		return true;
	}
}
