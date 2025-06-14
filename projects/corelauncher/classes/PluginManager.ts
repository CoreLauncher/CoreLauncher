import type { PluginShape } from "../../../packages/types";

type Plugin = {
	id: string;
	name: string;
	description: string;
	Plugin: new (
		...args: ConstructorParameters<typeof PluginShape>
	) => PluginShape;
};

type LoadedPlugin = Plugin & {
	class?: InstanceType<typeof PluginShape>;
};

export default class PluginManager {
	plugins: LoadedPlugin[];
	constructor() {
		this.plugins = [];
	}

	async loadPlugin(plugin: Plugin) {
		this.plugins.push({
			...plugin,
			class: new plugin.Plugin(),
		});
	}

	async enablePlugin(id: string) {}

	async disablePlugin(id: string) {}
}
