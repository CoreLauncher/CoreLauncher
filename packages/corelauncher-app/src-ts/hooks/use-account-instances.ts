import { useEffect, useState } from "react";
import type { AccountInstance } from "../types/accounts";
import useCoreLauncher from "./use-corelauncher";

export default function useAccountInstances() {
	const corelauncher = useCoreLauncher();
	const [accountInstances, setAccountInstances] = useState(
		corelauncher.accountInstances,
	);

	useEffect(() => {
		function onChange(instances: AccountInstance[]) {
			setAccountInstances(instances);
		}

		corelauncher.on("account_instances_updated", onChange);
		return () => {
			corelauncher.off("account_instances_updated", onChange);
		};
	}, [corelauncher]);

	return accountInstances;
}
