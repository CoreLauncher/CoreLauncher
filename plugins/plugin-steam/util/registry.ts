import { enumerateValues, HKEY, type RegistryValueType } from "registry-js";

export async function getRegistryEntry() {
	const entries = enumerateValues(
		HKEY.HKEY_CURRENT_USER,
		"Software\\Valve\\Steama",
	);

	return Object.fromEntries(
		entries.map((entry) => [
			entry.name,
			{
				value: entry.data,
				type: entry.type as RegistryValueType,
			},
		]),
	);
}

export async function getSteamInstallationDirectory() {
	const registry = await getRegistryEntry();
	return registry.SteamPath?.value;
}

export async function getSteamInstalled() {
	const installationDirectory = await getSteamInstallationDirectory();
	return !!installationDirectory;
}
