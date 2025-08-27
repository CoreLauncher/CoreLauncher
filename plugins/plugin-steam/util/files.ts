import { existsSync } from "node:fs";
import { join } from "node:path";
import { env } from "bun";
import * as registry from "native-reg";

export function getSteamInstallationDirectory() {
	switch (process.platform) {
		case "win32": {
			return registry.getValue(
				registry.HKEY.CURRENT_USER,
				"Software\\Valve\\Steam",
				"SteamPath",
			) as string;
		}
		case "linux": {
			const home = env.HOME!;
			const directories = [
				join(home, `/.steam/steam/`),
				join(home, `/.var/app/com.valvesoftware.Steam/.steam/steam/`),
			];

			return (
				directories.find((directory) => {
					return existsSync(directory);
				}) ?? null
			);
		}
	}

	return null;
}

export function getSteamInstalled() {
	const installationDirectory = getSteamInstallationDirectory();
	return !!installationDirectory;
}
