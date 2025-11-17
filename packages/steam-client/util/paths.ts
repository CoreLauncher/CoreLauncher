import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseVDF } from "@node-steam/vdf";
import { env } from "bun";
import * as registry from "native-reg";
import type { SteamLibraries } from "../types/SteamLibraries";

export function isSteamInstalled() {
	const directory = getSteamDirectory();
	return !!directory;
}

export function getSteamDirectory() {
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

export function getLibraries() {
	const steamDirectory = getSteamDirectory();
	if (!steamDirectory) return [];

	const librariesFile = join(steamDirectory, "steamapps", "libraryfolders.vdf");
	if (!existsSync(librariesFile)) return [];

	const librariesContent = readFileSync(librariesFile, "utf-8");
	const librariesParsed = parseVDF(librariesContent) as SteamLibraries;
	const libraries = librariesParsed.libraryfolders;

	return Object.values(libraries).map((library) => ({
		path: library.path,
		apps: Object.keys(library.apps).map((id) => Number(id)),
	}));
}

export function getApplicationLibraryDirectory(id: number) {
	const libraries = getLibraries();
	const library = libraries.find((library) => library.apps.indexOf(id) !== -1);
	if (!library) return null;
	return join(library.path, "steamapps", `common`);
}
