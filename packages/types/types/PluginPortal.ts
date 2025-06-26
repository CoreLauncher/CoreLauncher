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

	/**
	 * Retrieves a specific game by its ID.
	 * @param id The ID of the game to retrieve.
	 * @return {GameShape} The GameShape object representing the game.
	 * @throws {Error} If the game with the specified ID does not exist.
	 */
	abstract getGame(id: string): GameShape;
}
