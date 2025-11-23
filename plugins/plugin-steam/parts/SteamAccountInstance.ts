import { SteamClient } from "@corelauncher/steam-client";
import { AccountInstanceShape } from "@corelauncher/types";
import SteamGame from "./SteamGame";

interface SteamAccountInstanceEvents {
	games: (games: SteamGame[]) => void;
}

export default class SteamAccountInstance extends AccountInstanceShape<SteamAccountInstanceEvents> {
	providerId = "steam";

	id: string;
	name: string;

	games: SteamGame[] = [];

	client: SteamClient;
	constructor(data: {
		id: number;
		name: string;
		accessToken: string;
		refreshToken: string;
	}) {
		super();

		// Generate a unique ID based on the account name
		// We do this to protect the account name from logs or other plugins
		this.id = `steam:${Bun.hash(data.name)}`;
		this.name = data.name;

		this.client = new SteamClient({
			refreshToken: data.refreshToken,
		});

		this.client.on("apps", () => {
			console.info("Received Steam games");
			this.games = this.client.apps.map((app) => new SteamGame(app));
			this.emit("games", this.games);
		});
	}
}
