import type { AccountInstance, AccountProvider } from "./accounts";
import type { GameInstance, GameProfile, GameProvider } from "./games";

export type PluginEvent =
	| {
			type: "account_providers_updated";
			payload: AccountProvider[];
	  }
	| {
			type: "account_instances_updated";
			payload: AccountInstance[];
	  }
	| {
			type: "game_providers_updated";
			payload: GameProvider[];
	  }
	| {
			type: "game_instances_updated";
			payload: GameInstance[];
	  }
	| {
			type: "game_profiles_updated";
			payload: GameProfile[];
	  };
