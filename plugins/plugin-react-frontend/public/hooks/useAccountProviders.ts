import { useEffect, useState } from "react";
import Events from "../classes/Events";
import type { AccountProvider } from "../types";

export default function useAccountProviders() {
	const events = Events.getInstance();
	const [accountProviders, setAccountProviders] = useState<AccountProvider[]>(
		events.getValue<AccountProvider[]>("account_providers") ?? [],
	);

	useEffect(() => {
		function onChange(newAccountProviders: AccountProvider[]) {
			setAccountProviders(newAccountProviders);
		}

		events.on("account_providers", onChange);
		return () => {
			events.off("account_providers", onChange);
		};
	}, [events]);

	return accountProviders;
}
