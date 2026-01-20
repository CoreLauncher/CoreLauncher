type LoaderType = "vanilla" | "fabric";

type FabricLoaderVersionListResponse = {
	loader: { version: string; stable: boolean };
}[];

export async function fetchGameVersions(loaderType: LoaderType): Promise<
	{
		name: string;
		stable: boolean;
	}[]
> {
	switch (loaderType) {
		case "vanilla": {
			const response = await fetch(
				"https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
			);
			const data = await response.json();
			return data.versions.map((version: { id: string; type: string }) => ({
				name: version.id,
				stable: version.type === "release",
			}));
		}
		case "fabric": {
			const response = await fetch(
				"https://meta.fabricmc.net/v2/versions/game",
			);
			const data = await response.json();
			return data.map((version: { version: string; stable: boolean }) => ({
				name: version.version,
				stable: version.stable,
			}));
		}
	}
}

export async function fetchLoaderVersions(
	loaderType: LoaderType,
	gameVersion: string,
): Promise<
	{
		name: string;
		stable: boolean;
	}[]
> {
	switch (loaderType) {
		case "vanilla":
			return [{ name: "N/A", stable: true }];
		case "fabric": {
			const response = await fetch(
				`https://meta.fabricmc.net/v1/versions/loader/${gameVersion}`,
			);
			const data = (await response.json()) as FabricLoaderVersionListResponse;
			return data.map((version) => ({
				name: version.loader.version,
				stable: version.loader.stable,
			}));
		}
	}
}
