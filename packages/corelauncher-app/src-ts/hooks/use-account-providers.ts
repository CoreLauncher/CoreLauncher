import { useEffect, useState } from "react";
import type { AccountProvider } from "../types/accounts";
import useCoreLauncher from "./use-corelauncher";

export default function useAccountProviders() {
	const corelauncher = useCoreLauncher();
	const [accountProviders, setAccountProviders] = useState(
		corelauncher.accountProviders,
	);

	useEffect(() => {
		function onChange(providers: AccountProvider[]) {
			setAccountProviders(providers);
		}

		corelauncher.on("account_providers_updated", onChange);
		return () => {
			corelauncher.off("account_providers_updated", onChange);
		};
	}, [corelauncher]);

	return accountProviders;
}
