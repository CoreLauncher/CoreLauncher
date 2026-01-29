import { GameProfileShape } from "@corelauncher/sdk";
import { ensureDirSync } from "fs-extra";
import type { Selectable } from "kysely";
import type { MinecraftPlugin } from "..";
import type { Database } from "../types/database";
import { fillTemplates } from "../utility/fill-templates";

export default class MinecraftGameProfile extends GameProfileShape {
	game = "minecraft:minecraft_java";

	private plugin: MinecraftPlugin;
	private data: Selectable<Database["profiles"]>;
	constructor(plugin: MinecraftPlugin, data: Selectable<Database["profiles"]>) {
		super();

		this.plugin = plugin;
		this.data = data;
	}

	get id() {
		return this.data.id.toString();
	}

	get name() {
		return this.data.name;
	}

	get subname() {
		return `Minecraft ${this.data.loaderType} ${this.data.gameVersion}`;
	}

	async launch() {
		const manifest = await this.plugin.downloadVersionManifest(
			this.data.gameVersion,
		);
		const assetIndex = await this.plugin.downloadAssetIndex(manifest);
		await this.plugin.downloadAssets(assetIndex);
		const libraries = await this.plugin.downloadLibraries(manifest);
		const client = await this.plugin.downloadClient(manifest);

		const account = this.plugin.getAccount();
		if (!account) throw new Error("No Minecraft account selected");
		const profile = await account.fetchProfile();

		const templates = {
			version_type: manifest.type,
			version_name: manifest.id,

			auth_uuid: profile.id,
			auth_xuid: "",
			auth_access_token: profile.accessToken,
			auth_player_name: profile.username,

			assets_index_name: manifest.assets,
			assets_root: `${this.plugin.portal.getDataDirectory()}/assets/`,

			launcher_version: "1.0.0",
			launcher_name: "CoreLauncher",

			game_directory: `${this.plugin.portal.getDataDirectory()}/instances/${this.id}/`,
			natives_directory: `${this.plugin.portal.getDataDirectory()}/natives/`,

			clientid: "",
			classpath: [...libraries, client].join(";"),
		};

		ensureDirSync(templates.game_directory);
		ensureDirSync(templates.natives_directory);

		const processArguments = [
			...manifest.arguments.jvm,
			manifest.mainClass,
			...manifest.arguments.game,
		]
			.filter((argument) => {
				if (typeof argument === "string") return true;
				return this.plugin.evaluateRules(argument.rules);
			})
			.flatMap((argument) => {
				if (typeof argument === "string") return argument;
				return argument.value;
			})
			.map((arg) => fillTemplates(arg, templates));

		console.log(processArguments);

		Bun.spawnSync({
			cmd: ["java", ...processArguments],
			cwd: templates.game_directory,
			stdio: ["inherit", "inherit", "inherit"],
		});

		console.log(`Launching Minecraft profile ${this.name}`);
		return true;
	}
}
