import type { PluginShape } from "../shapes/PluginShape";

/**
 * This type represents the values exported by a plugin.
 */
export type PluginExport = {
	id: string;
	name: string;
	description: string;
	Plugin: new (
		...args: ConstructorParameters<typeof PluginShape>
	) => PluginShape;
};
