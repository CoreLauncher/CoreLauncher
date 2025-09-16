import { exists, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseVDF } from "@node-steam/vdf";
import { getSteamInstallationDirectory, getSteamInstalled } from "./files";

type LibraryFoldersVDF = {
	libraryfolders: {
		[key: string]: {
			path: string;
			label: string;
			contentid: number;
			totalsize: number;
			update_clean_bytes_tally: number;
			time_last_update_verified: number;
			apps: {
				[key: string]: number;
			};
		};
	};
};

type AppManifestACF = {
	AppState: {
		appid: number;
		universe: number;
		LauncherPath: string;
		name: string;
		StateFlags: number;
		installdir: string;
		LastUpdated: number;
		LastPlayed: number;
		SizeOnDisk: number;
		StagingSize: number;
		buildid: number;
		LastOwner: number;
		DownloadType: number;
		UpdateResult: number;
		BytesToDownload: number;
		BytesDownloaded: number;
		BytesToStage: number;
		BytesStaged: number;
		TargetBuildID: string;
		AutoUpdateBehavior: number;
		AllowOtherDownloadsWhileRunning: number;
		ScheduledAutoUpdate: number;
		FullValidateAfterNextUpdate: number;
		InstalledDepots: {
			[key: string]: {
				manifest: number;
				size: number;
			};
		};
		InstallScripts: {
			[key: string]: string;
		};
		UserConfig: {
			BetaKey: "public";
		};
		MountedConfig: {
			BetaKey: "public";
		};
	};
};

export async function getSteamLibraries() {
	const installationDirectory = getSteamInstallationDirectory();
	const libraryFoldersFile = `${installationDirectory}/steamapps/libraryfolders.vdf`;
	const libraryFolders = parseVDF(
		await readFile(libraryFoldersFile, "utf-8"),
	) as LibraryFoldersVDF;

	const folders = Object.values(libraryFolders.libraryfolders);

	return folders.map((folder) => ({
		path: folder.path,
		label: folder.label,
		apps: Object.keys(folder.apps),
	}));
}

export async function getSteamAppManifest(library: string, app: string) {
	const file = `${library}/steamapps/appmanifest_${app}.acf`;
	const fileExists = await exists(file);
	if (!fileExists) return null; // The library manifest if somehow corrupted...
	const content = await readFile(file, "utf-8");
	const manifest = parseVDF(content) as AppManifestACF;
	return manifest.AppState;
}

export async function getSteamGames() {
	if (!getSteamInstalled()) return [];
	const libraries = await getSteamLibraries();
	const apps = [];

	for (const library of libraries) {
		const path = library.path;
		const appIds = library.apps;

		for (const appId of appIds) {
			const manifest = await getSteamAppManifest(path, appId);
			if (!manifest) continue;
			apps.push({
				id: manifest.appid,
				name: manifest.name,
				directory: join(path, "/steamapps/common/", manifest.installdir),
			});
		}
	}

	return apps;
}
