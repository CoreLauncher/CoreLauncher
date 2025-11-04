import { type SteamAppInfo, validateSteamAppInfo } from "../types/SteamAppInfo";
import type { SteamClient } from "./SteamClient";

export default class SteamApp {
	client: SteamClient;
	data: SteamAppInfo;
	constructor(client: SteamClient, data: SteamAppInfo) {
		// validateSteamAppInfo(data);
		this.client = client;
		this.data = data;
		console.log(data.appid, data.common?.type);
	}

	get id() {
		return this.data.appid;
	}
}
