import { GameProviderShape } from "@corelauncher/sdk/shapes/GameProviderShape";
import type SteamAccountInstance from "./SteamAccountInstance";
import type SteamGameInstance from "./SteamGameInstance";

interface SteamGameProviderEvents {
	game_instances_updated: (instances: SteamGameInstance[]) => void;
}

export class SteamGameProvider extends GameProviderShape<SteamGameProviderEvents> {
	id = "steam";
	name = "Steam";

	gameListeners = new Map<SteamAccountInstance, () => void>();
	gameInstances = new Map<SteamAccountInstance, SteamGameInstance[]>();

	unRegisterListeners() {
		this.gameListeners.forEach((listener, account) => {
			account.off("games", listener);
		});
		this.gameListeners.clear();
	}

	registerAccounts(accounts: SteamAccountInstance[]) {
		this.unRegisterListeners();

		accounts.forEach((account) => {
			const listener = () => {
				this.gameInstances.set(account, account.games);
				this.emitGames();
			};
			account.on("games", listener);
			this.gameListeners.set(account, listener);
		});
	}

	emitGames() {
		const games = this.gameInstances.values().toArray().flat();
		this.emit("game_instances_updated", games);
	}
}
