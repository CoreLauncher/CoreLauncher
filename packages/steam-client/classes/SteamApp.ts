import { type SteamAppInfo, validateSteamAppInfo } from "../types/SteamAppInfo";
import type { SteamClient } from "./SteamClient";

export default class SteamApp {
	client: SteamClient;
	data: SteamAppInfo;
	constructor(client: SteamClient, data: SteamAppInfo) {
		this.client = client;
		this.data = data;
	}

	get id() {
		return this.data.appid;
	}
}
