import { enumerateValues, HKEY, type RegistryValueType } from "registry-js";

export async function getRegistryEntry() {
	const entries = enumerateValues(
		HKEY.HKEY_CURRENT_USER,
		"Software\\Epic Games\\EOS",
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

export async function getEpicInstallationDirectory() {
	const registry = await getRegistryEntry();
	return registry.ModSdkMetadataDir?.value as string | undefined;
}

export async function getEpicInstalled() {
	const installationDirectory = await getEpicInstallationDirectory();
	return !!installationDirectory;
}
