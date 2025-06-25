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

export async function getEpicInstallationDirectory(): Promise<string> {
	const registry = await getRegistryEntry();
	const dir = registry.ModSdkMetadataDir!.value;

	if (!dir || typeof dir !== "string") {
		throw new Error("eeh err");
	}

	return dir;
}
