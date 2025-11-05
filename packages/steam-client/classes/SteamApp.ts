import type { SteamAppInfo } from "../types/SteamAppInfo";
import type { SteamClient } from "./SteamClient";

const STEAM_ASSET_URL =
	"https://shared.fastly.steamstatic.com/community_assets/images/apps/";

export class SteamApp {
	client: SteamClient;
	data: SteamAppInfo;
	constructor(client: SteamClient, data: SteamAppInfo) {
		this.client = client;
		this.data = data;
	}

	get id() {
		return this.data.appid;
	}

	get name() {
		return this.data.common.name;
	}

	get iconUrl() {
		if (!this.data.common.icon) return null;
		return `${STEAM_ASSET_URL}${this.data.appid}/${this.data.common.icon}.jpg`;
	}
}
