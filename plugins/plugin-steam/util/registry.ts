import { promisified as regedit } from "regedit";

export async function getRegistryEntry() {
	const key = "HKCU\\Software\\Valve\\Steam";
	const entries = await regedit.list([key]);
	const entry = entries[key];
	return entry.values;
}

export async function getSteamInstallationDirectory() {
	const registry = await getRegistryEntry();
	return registry.SteamPath!.value;
}
