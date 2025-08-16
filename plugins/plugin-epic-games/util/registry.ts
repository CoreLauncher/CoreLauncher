import * as registry from "native-reg";

export async function getEpicInstallationDirectory() {
	const installationDirectory = registry.getValue(
		registry.HKEY.CURRENT_USER,
		"Software\\Epic Games\\EOS",
		"ModSdkMetadataDir",
	);

	return installationDirectory as string | null;
}

export async function getEpicInstalled() {
	const installationDirectory = await getEpicInstallationDirectory();
	return !!installationDirectory;
}
