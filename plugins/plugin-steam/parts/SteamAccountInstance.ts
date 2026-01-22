import { AccountInstanceShape } from "@corelauncher/sdk";
import { SteamClient } from "@corelauncher/steam-client";
import SteamGameInstance from "./SteamGameInstance";

interface SteamAccountInstanceEvents {
	games: (games: SteamGameInstance[]) => void;
}

export default class SteamAccountInstance extends AccountInstanceShape<SteamAccountInstanceEvents> {
	provider = "steam";

	id: string;
	name: string;
	avatarUrl = null;

	games: SteamGameInstance[] = [];

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
			this.games = this.client.apps.map((app) => new SteamGameInstance(app));
			this.emit("games", this.games);
		});
	}

	disconnect() {}
}
