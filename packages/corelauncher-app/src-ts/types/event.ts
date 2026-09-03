import type { AccountProvider } from "./account-provider";

export type PluginEvent = {
	type: "account_providers_updated";
	payload: AccountProvider[];
};
