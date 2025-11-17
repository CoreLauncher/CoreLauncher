import { join } from "node:path";
import type { SteamAppInfo } from "../types/SteamAppInfo";
import { getApplicationLibraryDirectory } from "../util/paths";
import type { SteamClient } from "./SteamClient";

export class SteamApp {
	client: SteamClient;
	data: SteamAppInfo;
	constructor(client: SteamClient, data: SteamAppInfo) {
		this.client = client;
		this.data = data;

		if (this.id === 648800) console.log(this.getDirectory());
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
		if (!this.data.common.library_assets_full?.library_hero.image?.english)
			return null;
		return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${this.data.appid}/${this.data.common.library_assets_full?.library_hero?.image?.english}`;
	}

	get capsuleUrl() {
		if (!this.data.common.library_assets_full?.library_capsule?.image?.english)
			return null;
		return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${this.data.appid}/${this.data.common.library_assets_full?.library_capsule?.image?.english}`;
	}

	/**
	 * @returns path to the application
	 */
	getDirectory() {
		const libraryDirectory = getApplicationLibraryDirectory(this.id);
		const installDirectory = this.data.config?.installdir;
		if (!libraryDirectory || !installDirectory) return null;
		return join(libraryDirectory, installDirectory);
	}

	/**
	 * gets the status of the application
	 */
	getStatus() {}
}
