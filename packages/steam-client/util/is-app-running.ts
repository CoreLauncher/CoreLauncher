import * as registry from "native-reg";
import { isSteamInstalled } from "./paths";

export default function isAppRunning(id: number) {
	if (process.platform !== "win32") return false;
	if (!isSteamInstalled()) return false;

	const value = registry.getValue(
		registry.HKCU,
		`Software\\Valve\\Steam\\Apps\\${id}`,
		"Running",
	);

	return value === 1;
}
