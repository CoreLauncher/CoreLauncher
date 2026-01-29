import { readFileSync } from "node:fs";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import { noop } from "@corelauncher/noop";
import {
	GameFeature,
	GameInstanceShape,
	GameState,
	type Option,
	OptionType,
} from "@corelauncher/sdk";
import type { Kysely } from "kysely";
import type { MinecraftPlugin } from "..";
import capsuleSVG from "../assets/minecraft-game-capsule.svg";
import logoSVG from "../assets/minecraft-game-logo.svg";
import type { Database } from "../types/database";
import { fetchGameVersions, fetchLoaderVersions } from "../utility/versions";
import MinecraftGameProfile from "./MinecraftGameProfile";

const iconUrl = dataToDataURL(readFileSync(logoSVG, "utf-8"), "image/svg+xml");
const capsuleUrl = dataToDataURL(
	readFileSync(capsuleSVG, "utf-8"),
	"image/svg+xml",
);

type CreateProfileOptions = {
	loader_type: "vanilla" | "fabric";
	loader_version: string;
	game_version: string;
	ram_amount: number;
	ram_unit: "gib" | "mib";
};

interface MinecraftGameInstanceEvents {
	game_profiles_updated: (profiles: MinecraftGameProfile[]) => void;
}

export default class MinecraftGameInstance extends GameInstanceShape<MinecraftGameInstanceEvents> {
	id = "minecraft:minecraft_java";
	name = "Minecraft: Java Edition";
	features = [GameFeature.NormalLaunch, GameFeature.Profiles];
	state = GameState.Installed;
	iconUrl = iconUrl;
	bannerUrl = null;
	capsuleUrl = capsuleUrl;

	provider = "minecraft";

	private plugin: MinecraftPlugin;
	private database: Kysely<Database>;
	private profiles: MinecraftGameProfile[] = [];
	constructor(plugin: MinecraftPlugin, database: Kysely<Database>) {
		super();

		this.plugin = plugin;
		this.database = database;

		noop().then(async () => {
			const data = await this.database
				.selectFrom("profiles")
				.selectAll()
				.execute();

			this.profiles = data.map(
				(profile) => new MinecraftGameProfile(this.plugin, profile),
			);
			this.emit("game_profiles_updated", this.profiles);
		});
	}

	async launch() {
		console.log("Launching Minecraft Java Edition...");
		return true;
	}

	async createProfileOptions(options: Partial<CreateProfileOptions>) {
		if (!options.loader_type) options.loader_type = "vanilla";
		const gameVersions = await fetchGameVersions(options.loader_type);
		if (!options.game_version)
			options.game_version = gameVersions.find(
				(version) => version.stable,
			)!.name;
		const loaderVersions = await fetchLoaderVersions(
			options.loader_type!,
			options.game_version!,
		);
		if (!options.loader_version)
			options.loader_version = loaderVersions.find(
				(version) => version.stable,
			)!.name;

		return [
			{
				type: OptionType.OptionRow,
				options: [
					{
						type: OptionType.Dropdown,
						label: "Type",
						id: "loader_type",
						default: options.loader_type,
						required: true,
						values: [
							{ label: "Vanilla", value: "vanilla" },
							{ label: "Fabric", value: "fabric" },
						],
					},
					{
						type: OptionType.Dropdown,
						label: "Game version",
						id: "game_version",
						required: true,
						default: options.game_version,
						values: gameVersions
							.filter((version) => version.stable)
							.map((version) => ({ label: version.name, value: version.name })),
					},
					{
						type: OptionType.Dropdown,
						label: "Loader version",
						id: "loader_version",
						disabled: options.loader_type === "vanilla",
						required: true,
						default: options.loader_version,
						values: loaderVersions.map((version) => ({
							label: version.name,
							value: version.name,
						})),
					},
				],
			},
			{
				type: OptionType.OptionRow,
				options: [
					{
						type: OptionType.Number,
						label: "RAM Amount",
						id: "ram_amount",
						default: 4,
						required: true,
					},
					{
						type: OptionType.Dropdown,
						label: "RAM Unit",
						id: "ram_unit",
						default: "gib",
						required: true,
						values: [
							{
								label: "GiB",
								value: "gib",
							},
							{
								label: "MiB",
								value: "mib",
							},
						],
					},
				],
			},
		] as Option[];
	}

	async createProfile(name: string, options: CreateProfileOptions) {
		console.log(name, options);
		const data = await this.database
			.insertInto("profiles")
			.values({
				name: name,
				gameVersion: options.game_version,
				loaderType: options.loader_type,
				loaderVersion:
					options.loader_version === "N/A" ? null : options.loader_version,
				ramAmount: options.ram_amount,
				ramUnit: options.ram_unit,
			})
			.returningAll()
			.execute();

		console.log(data);

		const profile = new MinecraftGameProfile(this.plugin, data[0]!);
		this.profiles.push(profile);
		this.emit("game_profiles_updated", this.profiles);
		return profile;
	}
}
