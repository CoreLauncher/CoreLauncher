import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { getEpicInstallationDirectory } from "./registry";

type EpicManifest = {
	FormatVersion: number;
	bIsIncompleteInstall: boolean;
	LaunchCommand: string;
	LaunchExecutable: string;
	ManifestLocation: string;
	ManifestHash: string;
	bIsApplication: boolean;
	bIsExecutable: boolean;
	bIsManaged: boolean;
	bNeedsValidation: boolean;
	bRequiresAuth: boolean;
	bAllowMultipleInstances: boolean;
	bCanRunOffline: boolean;
	bAllowUriCmdArgs: boolean;
	bLaunchElevated: boolean;
	BaseURLs: string[];
	BuildLabel: string;
	AppCategories: string[];
	//ChunkDbs: any[];
	//CompatibleApps: any[];
	DisplayName: string;
	InstallationGuid: string;
	InstallLocation: string;
	InstallSessionId: string;
	//InstallTags: any[];
	//InstallComponents: any[];
	HostInstallationGuid: string;
	//PrereqIds: any[];
	PrereqSHA1Hash: string;
	LastPrereqSucceededSHA1Hash: string;
	StagingLocation: string;
	TechnicalType: string;
	VaultThumbnailUrl: string;
	VaultTitleText: string;
	InstallSize: number;
	MainWindowProcessName: string;
	//ProcessNames: any[];
	//BackgroundProcessNames: any[];
	//IgnoredProcessNames: any[];
	//DlcProcessNames: any[];
	MandatoryAppFolderName: string;
	OwnershipToken: string;
	SidecarConfigRevision: number;
	CatalogNamespace: string;
	CatalogItemId: string;
	AppName: string;
	AppVersionString: string;
	MainGameCatalogNamespace: string;
	MainGameCatalogItemId: string;
	MainGameAppName: string;
	//AllowedUriEnvVars: any[];
};

export async function getEpicGames() {
	const manifestDir = await getEpicInstallationDirectory();
	const files = await readdir(manifestDir);

	const games: {
		id: string;
		name: string;
		directory: string;
		exe: string;
		command: string;
		version: string;
		manifest: EpicManifest;
	}[] = [];

	for (const file of files) {
		const filePath = join(manifestDir, file);

		const fileStats = await stat(filePath);
		if (fileStats.isDirectory()) continue;

		const content = await readFile(filePath, "utf-8");

		const manifest = JSON.parse(content) as EpicManifest;

		games.push({
			id: manifest.AppName,
			name: manifest.DisplayName,
			directory: manifest.InstallLocation,
			exe: manifest.LaunchExecutable,
			command: manifest.LaunchCommand,
			version: manifest.AppVersionString,
			manifest,
		});
	}

	return games;
}
