import type { SteamApp } from "@corelauncher/steam-client";
import type { GameShape } from "@corelauncher/types";
import open from "open";

export default class SteamGame implements GameShape {
	app: SteamApp;

	constructor(app: SteamApp) {
		this.app = app;
	}

	get id() {
		return `steam:${this.app.id}`;
	}

	get name() {
		return this.app.name;
	}

	get iconUrl() {
		return this.app.iconUrl;
	}

	get bannerUrl() {
		return this.app.bannerUrl;
	}

	get capsuleUrl() {
		return this.app.capsuleUrl;
	}

	async launch() {
		await open(`steam://launch/${this.app.id}`);
		return true;
	}
}
