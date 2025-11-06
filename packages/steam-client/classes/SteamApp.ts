import type { SteamAppInfo } from "../types/SteamAppInfo";
import type { SteamClient } from "./SteamClient";

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
		return `https://shared.fastly.steamstatic.com/community_assets/images/apps/${this.data.appid}/${this.data.common.icon}.jpg`;
	}

	get bannerUrl() {
		if (!this.data.common.library_assets?.library_hero) return null;
		return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${this.data.appid}/library_hero.jpg`;
	}
}
