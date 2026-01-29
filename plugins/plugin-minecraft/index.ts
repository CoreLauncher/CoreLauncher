import { existsSync } from "node:fs";
import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import { type PluginPortal, PluginShape } from "@corelauncher/sdk";
import { migrations } from "./migrations";
import type MinecraftAccountInstance from "./parts/MinecraftAccountInstance";
import MinecraftAccountProvider from "./parts/MinecraftAccountProvider";
import MinecraftGameInstance from "./parts/MinecraftGameInstance";
import type MinecraftGameProfile from "./parts/MinecraftGameProfile";
import { MinecraftGameProvider } from "./parts/MinecraftGameProvider";
import type { AssetIndex } from "./types/asset-index";
import type { Database } from "./types/database";
import type { Rule } from "./types/rule";
import type { MinecraftVersionManifest } from "./types/version-manifest";
import { getOS } from "./utility/get-os";
import { hashFile } from "./utility/hash-file";

async function noop() {}

export const id = "plugin-minecraft";
export const format = 1;
export const name = "Minecraft";
export const description = "Allows you to launch Minecraft from CoreLauncher.";

export class MinecraftPlugin extends PluginShape {
	portal: PluginPortal;

	gameProviders: MinecraftGameProvider[] = [];
	gameInstances: MinecraftGameInstance[] = [];
	gameProfiles: MinecraftGameProfile[] = [];
	accountProviders: MinecraftAccountProvider[] = [];
	accountInstances: MinecraftAccountInstance[] = [];

	constructor(portal: PluginPortal) {
		super(portal);

		this.portal = portal;

		noop().then(async () => {
			const database = await createDatabase<Database>(
				join(portal.getDataDirectory(), "database.sqlite"),
				migrations,
			);

			const gameProvider = new MinecraftGameProvider();
			this.gameProviders = [gameProvider];
			this.emit("game_providers_updated");

			const gameInstance = new MinecraftGameInstance(this, database);
			this.gameInstances = [gameInstance];
			this.emit("game_instances_updated");

			gameInstance.on("game_profiles_updated", (profiles) => {
				this.gameProfiles = profiles;
				this.emit("game_profiles_updated");
			});

			const accountProvider = new MinecraftAccountProvider(database);
			this.accountProviders = [accountProvider];
			this.emit("account_providers_updated");

			portal.on("protocol_launch", (url) => {
				const code = url.searchParams.get("code");
				if (url.host !== "plugin") return;
				if (url.pathname !== "/minecraft/login_callback") return;
				if (code === null) return;

				console.log(url);
				accountProvider.handleCode(code);
			});

			accountProvider.on("account_instances_updated", (instances) => {
				this.accountInstances = instances;
				this.emit("account_instances_updated");
			});

			this.emit("ready");
		});
	}

	evaluateRules(rules?: Rule[]) {
		if (!rules || rules.length === 0) return true;

		for (const rule of rules) {
			const passed = this.evaluateRule(rule);
			console.log(passed, rule);
			if (!passed) return false;
		}

		return true;
	}

	evaluateRule(rule: Rule) {
		if (rule.os) {
			if (rule.action === "allow" && rule.os.name !== getOS()) return false;
			if (rule.action === "disallow" && rule.os.name === getOS()) return false;
		}

		if (rule.features) return false;

		return true;
	}

	getAccount() {
		return this.accountInstances[0] || null;
	}

	async downloadGameVersionList() {
		const response = await fetch(
			"https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
		);
		const data = await response.json();
		return data.versions as {
			id: string;
			type: string;
			url: string;
			time: string;
			releaseTime: string;
			sha1: string;
			complianceLevel: number;
		}[];
	}

	async downloadVersionManifest(version: string, loader = "vanilla") {
		const versions = await this.downloadGameVersionList();
		const download = versions.find((v) => v.id === version);
		if (!download) throw new Error("Version not found");

		const file = join(
			this.portal.getDataDirectory(),
			"versions",
			`${loader}-${download.id}.json`,
		);

		if (!existsSync(file) || (await hashFile(file)) !== download.sha1) {
			const response = await fetch(download.url);
			const content = await response.text();
			await Bun.write(file, content);
		}

		const data = await Bun.file(file).json();
		return data as MinecraftVersionManifest;
	}

	async downloadAssetIndex(manifest: MinecraftVersionManifest) {
		const download = manifest.assetIndex;

		const file = join(
			this.portal.getDataDirectory(),
			"assets",
			"indexes",
			`${download.id}.json`,
		);

		if (!existsSync(file) || (await hashFile(file)) !== download.sha1) {
			const response = await fetch(download.url);
			const content = await response.text();
			await Bun.write(file, content);
		}

		const data = await Bun.file(file).json();
		return data as AssetIndex;
	}

	async downloadAssets(index: AssetIndex) {
		const objects = index.objects;
		const hashes = Object.values(objects).map((obj) => obj.hash);

		for (const hash of hashes) {
			const prefix = hash.substring(0, 2);
			const file = join(
				this.portal.getDataDirectory(),
				"assets",
				"objects",
				prefix,
				hash,
			);

			console.log(`Downloading asset ${hash}...`);
			if (existsSync(file)) continue;

			const url = `https://resources.download.minecraft.net/${prefix}/${hash}`;
			const response = await fetch(url);
			const content = await response.arrayBuffer();
			await Bun.write(file, new Uint8Array(content));
		}
	}

	async downloadLibraries(manifest: MinecraftVersionManifest) {
		const libraries = manifest.libraries;
		const paths = [];

		for (const library of libraries) {
			const artifact = library.downloads.artifact;
			if (!this.evaluateRules(library.rules)) continue;

			const file = join(
				this.portal.getDataDirectory(),
				"libraries",
				artifact.path,
			);

			console.log(`Downloading library ${library.name}...`);

			paths.push(file);

			if (existsSync(file) && (await hashFile(file)) === artifact.sha1)
				continue;

			const response = await fetch(artifact.url);
			const content = await response.arrayBuffer();
			await Bun.write(file, new Uint8Array(content));
		}

		return paths;
	}

	async downloadClient(manifest: MinecraftVersionManifest) {
		const download = manifest.downloads.client;

		const file = join(
			this.portal.getDataDirectory(),
			"versions",
			`${manifest.id}-client.jar`,
		);

		if (!existsSync(file) || (await hashFile(file)) !== download.sha1) {
			const response = await fetch(download.url);
			const content = await response.arrayBuffer();
			await Bun.write(file, new Uint8Array(content));
		}

		return file;
	}
}

export const Plugin = MinecraftPlugin;
