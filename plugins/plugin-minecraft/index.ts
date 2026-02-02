import { existsSync } from "node:fs";
import { join } from "node:path";
import createDatabase from "@corelauncher/database";
import { type PluginPortal, PluginShape } from "@corelauncher/sdk";
import { ensureDirSync } from "fs-extra";
import { migrations } from "./migrations";
import type MinecraftAccountInstance from "./parts/MinecraftAccountInstance";
import MinecraftAccountProvider from "./parts/MinecraftAccountProvider";
import MinecraftGameInstance from "./parts/MinecraftGameInstance";
import type MinecraftGameProfile from "./parts/MinecraftGameProfile";
import { MinecraftGameProvider } from "./parts/MinecraftGameProvider";
import type { AssetIndex } from "./types/asset-index";
import type { Database } from "./types/database";
import type {
	JavaComponentIndex,
	JavaComponentManifest,
} from "./types/java-components";
import type { Rule } from "./types/rule";
import type { MinecraftVersionManifest } from "./types/version-manifest";
import { fillTemplates } from "./utility/fill-templates";
import { getComponentOS, getOS } from "./utility/get-os";
import { hashFile } from "./utility/hash-file";

async function noop() {}

export const id = "plugin-minecraft";
export const format = 1;
export const name = "Minecraft";
export const description = "Allows you to launch Minecraft from CoreLauncher.";

class MinecraftPlugin extends PluginShape {
	portal: PluginPortal;

	gameProviders: MinecraftGameProvider[] = [];
	gameInstances: MinecraftGameInstance[] = [];
	gameProfiles: MinecraftGameProfile[] = [];
	accountProviders: MinecraftAccountProvider[] = [];
	accountInstances: MinecraftAccountInstance[] = [];

	assetsDirectory: string;
	instancesDirectory: string;
	javaDirectory: string;
	librariesDirectory: string;
	nativesDirectory: string;
	versionsDirectory: string;

	constructor(portal: PluginPortal) {
		super(portal);

		this.portal = portal;

		const dataDirectory = this.portal.getDataDirectory();

		this.assetsDirectory = join(dataDirectory, "assets");
		ensureDirSync(this.assetsDirectory);

		this.instancesDirectory = join(dataDirectory, "instances");
		ensureDirSync(this.instancesDirectory);

		this.javaDirectory = join(dataDirectory, "java");
		ensureDirSync(this.javaDirectory);

		this.librariesDirectory = join(dataDirectory, "libraries");
		ensureDirSync(this.librariesDirectory);

		this.nativesDirectory = join(dataDirectory, "natives");
		ensureDirSync(this.nativesDirectory);

		this.versionsDirectory = join(dataDirectory, "versions");
		ensureDirSync(this.versionsDirectory);

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

	async fetchJavaComponentIndex() {
		const response = await fetch(
			"https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json",
		);
		const data = await response.json();
		return data as JavaComponentIndex;
	}

	async fetchJavaComponentManifest(component: string) {
		const file = join(this.javaDirectory, component, "manifest.json");

		if (!existsSync(file)) {
			const index = await this.fetchJavaComponentIndex();
			const os = getComponentOS();
			const download = index[os]?.[component]?.[0];

			if (!download) throw new Error("Java component not found");

			console.log(download);

			const response = await fetch(download.manifest.url);
			const content = await response.text();
			await Bun.write(file, content);
		}

		const data = await Bun.file(file).json();
		return data as JavaComponentManifest;
	}

	async downloadJava(component: string) {
		const directory = join(this.javaDirectory, component);
		ensureDirSync(directory);

		const manifest = await this.fetchJavaComponentManifest(component);

		for (const [path, info] of Object.entries(manifest.files)) {
			if (info.type === "directory") continue;
			const file = join(directory, path);
			const url = info.downloads.raw.url;

			if (existsSync(file)) continue;

			const response = await fetch(url);
			const bytes = await response.bytes();

			await Bun.write(file, bytes);

			console.log(file, path, info);
		}

		return directory;
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

	async generateArguments(
		manifest: MinecraftVersionManifest,
		account: MinecraftAccountInstance,
		directory: string,
		libraries: string[],
		client: string,
	) {
		const profile = await account.fetchProfile();

		const templates = {
			version_type: manifest.type,
			version_name: manifest.id,

			auth_uuid: profile.id,
			auth_xuid: "",
			auth_access_token: profile.accessToken,
			auth_player_name: profile.username,

			assets_index_name: manifest.assets,
			assets_root: this.assetsDirectory,

			launcher_version: "1.0.0",
			launcher_name: "CoreLauncher",

			game_directory: directory,
			natives_directory: `${this.portal.getDataDirectory()}/natives/`,

			clientid: "",
			classpath: [...libraries, client].join(";"),
		};

		return [
			...manifest.arguments.jvm,
			manifest.mainClass,
			...manifest.arguments.game,
		]
			.filter((argument) => {
				if (typeof argument === "string") return true;
				return this.evaluateRules(argument.rules);
			})
			.flatMap((argument) => {
				if (typeof argument === "string") return argument;
				return argument.value;
			})
			.map((arg) => fillTemplates(arg, templates));
	}

	async launchMinecraft(
		directory: string,
		versions: {
			game: string;
			loader: string | null;
			type: string;
		},
	) {
		const manifest = await this.downloadVersionManifest(versions.game);
		const assetIndex = await this.downloadAssetIndex(manifest);
		await this.downloadAssets(assetIndex);
		const libraries = await this.downloadLibraries(manifest);
		const java = await this.downloadJava(manifest.javaVersion.component);
		const client = await this.downloadClient(manifest);

		const account = this.getAccount();
		if (!account) throw new Error("No Minecraft account selected");

		ensureDirSync(directory);

		const processArguments = await this.generateArguments(
			manifest,
			account,
			directory,
			libraries,
			client,
		);

		Bun.spawnSync({
			cmd: [join(java, "bin/java.exe"), ...processArguments],
			cwd: directory,
			stdio: ["inherit", "inherit", "inherit"],
		});
	}
}

export const Plugin = MinecraftPlugin;
