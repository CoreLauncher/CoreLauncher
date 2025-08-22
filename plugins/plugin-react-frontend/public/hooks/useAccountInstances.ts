import { useEffect, useState } from "react";
import Events from "../classes/Events";
import type { AccountInstance } from "../types";

export default function useAccountInstances() {
	const events = Events.getInstance();
	const [accountInstances, setAccountInstances] = useState<AccountInstance[]>(
		events.getValue<AccountInstance[]>("account_instances") ?? [],
	);

	useEffect(() => {
		function onChange(newAccountInstances: AccountInstance[]) {
			setAccountInstances(newAccountInstances);
		}

		events.on("account_instances", onChange);
		return () => {
			events.off("account_instances", onChange);
		};
	}, [events]);

	return accountInstances;
}
