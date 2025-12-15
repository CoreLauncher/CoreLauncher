import { type SteamApp, SteamAppState } from "@corelauncher/steam-client";
import { GameShape, GameState } from "@corelauncher/types";
import open from "open";

export default class SteamGame extends GameShape {
	app: SteamApp;

	constructor(app: SteamApp) {
		super();
		this.app = app;

		let oldState: GameState = this.state;
		setInterval(() => {
			const newState = this.state;
			if (newState !== oldState) this.emit("state_changed", newState, oldState);
			oldState = newState;
		}, 5000);
	}

	get id() {
		return `steam:${this.app.id}`;
	}

	get name() {
		return this.app.name;
	}

	get state() {
		const status = this.app.getState();
		if (status === SteamAppState.Running) return GameState.Running;
		if (status === SteamAppState.Installed) return GameState.Installed;
		if (status === SteamAppState.NotInstalled) return GameState.NotInstalled;
		return GameState.Unknown;
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
