import type { PluginShape } from "../../../packages/types";

import * as ReactPlugin from "@corelauncher/plugin-react-frontend";

type Plugin = {
	id: string;
	name: string;
	description: string;
	Plugin: PluginShape;
};

export default class PluginManager {
	plugins: InstanceType<typeof PluginShape>[];
	constructor() {
		this.plugins = [];
	}

	async loadPlugin(plugin: Plugin) {}

	async enablePlugin(id: string) {}

	async disablePlugin(id: string) {}
}
