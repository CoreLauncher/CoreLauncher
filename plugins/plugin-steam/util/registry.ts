import * as registry from "native-reg";

export async function getSteamInstallationDirectory() {
	const installationDirectory = registry.getValue(
		registry.HKEY.CURRENT_USER,
		"Software\\Valve\\Steam",
		"SteamPath",
	);

	return installationDirectory as string | null;
}

export async function getSteamInstalled() {
	if (process.platform !== "win32") return false;
	const installationDirectory = await getSteamInstallationDirectory();
	return !!installationDirectory;
}
