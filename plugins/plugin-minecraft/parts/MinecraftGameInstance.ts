import { readFileSync } from "node:fs";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import {
	GameFeature,
	GameInstanceShape,
	GameState,
	type Option,
	OptionType,
} from "@corelauncher/sdk";
import capsuleSVG from "../assets/minecraft-game-capsule.svg";
import logoSVG from "../assets/minecraft-game-logo.svg";
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

	async launch() {
		console.log("Launching Minecraft Java Edition...");
		return true;
	}

	async createProfileOptions(values: Partial<CreateProfileOptions>) {
		if (!values.loader_type) values.loader_type = "vanilla";
		const gameVersions = await fetchGameVersions(values.loader_type);
		if (!values.game_version)
			values.game_version = gameVersions.find(
				(version) => version.stable,
			)!.name;
		const loaderVersions = await fetchLoaderVersions(
			values.loader_type!,
			values.game_version!,
		);
		if (!values.loader_version)
			values.loader_version = loaderVersions.find(
				(version) => version.stable,
			)!.name;

		console.log(values);
		return [
			{
				type: OptionType.OptionRow,
				options: [
					{
						type: OptionType.Dropdown,
						label: "Type",
						id: "loader_type",
						default: values.loader_type,
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
						default: values.game_version,
						values: gameVersions
							.filter((version) => version.stable)
							.map((version) => ({ label: version.name, value: version.name })),
					},
					{
						type: OptionType.Dropdown,
						label: "Loader version",
						id: "loader_version",
						disabled: values.loader_type === "vanilla",
						required: true,
						default: values.loader_version,
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

	async createProfile() {
		return new MinecraftGameProfile();
	}
}
