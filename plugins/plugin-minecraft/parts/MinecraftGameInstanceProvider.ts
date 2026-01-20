import {
	GameInstanceProviderShape,
	type Option,
	OptionType,
} from "@corelauncher/sdk";
import { fetchGameVersions, fetchLoaderVersions } from "../utility/versions";
import MinecraftGameInstance from "./MinecraftGameInstance";

type CreateOptions = {
	loader_type: "vanilla" | "fabric";
	loader_version: string;
	game_version: string;
};

export default class MinecraftGameInstanceProvider extends GameInstanceProviderShape {
	async createOptions(values: Partial<CreateOptions>) {
		values = {
			loader_type: "vanilla",
			...values,
		};

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
				id: "versions",
				label: "Loader",
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
		] as Option[];
	}

	async create() {
		return new MinecraftGameInstance();
	}
}
