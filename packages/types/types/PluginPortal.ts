import type { GameShape } from "../shapes/GameShape";

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export abstract class PluginPortal {
	/**
	 * Returns a list of games from all plugins.
	 * @returns {GameShape[]} An array of GameShape objects.
	 */
	abstract getGames(): GameShape[];
}
