import type { AccountInstance, AccountProvider } from "./accounts";

export type PluginEvent =
	| {
			type: "account_providers_updated";
			payload: AccountProvider[];
	  }
	| {
			type: "account_instances_updated";
			payload: AccountInstance[];
	  };
