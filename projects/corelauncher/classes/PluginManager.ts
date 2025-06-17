import type { GameShape, PluginShape } from "../../../packages/types";

type Plugin = {
	id: string;
	name: string;
	description: string;
	Plugin: new (
		...args: ConstructorParameters<typeof PluginShape>
	) => PluginShape;
};

type LoadedPlugin = Plugin & {
	constructed?: InstanceType<typeof PluginShape>;
	parts: {
		games: InstanceType<typeof GameShape>[];
	};
};

export default class PluginManager {
	plugins: LoadedPlugin[];
	constructor() {
		this.plugins = [];
	}

	async loadPlugin(plugin: Plugin) {
		const constructed = new plugin.Plugin();
		const loaded = {
			...plugin,
			constructed: constructed,
			parts: {
				games: [],
			},
		} as LoadedPlugin;

		constructed.on("games", (games: InstanceType<typeof GameShape>[]) => {
			loaded.parts.games = games;
		});

		this.plugins.push(loaded);
	}

	async enablePlugin(id: string) {}

	async disablePlugin(id: string) {}
}
