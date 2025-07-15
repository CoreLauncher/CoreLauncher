import type { AccountProviderShape } from "../shapes/AccountProviderShape";
import type { GameShape } from "../shapes/GameShape";

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export abstract class PluginPortal {
	/**
	 * Returns the data directory for the plugin.
	 * @returns {string} The path to the plugin's data directory.
	 */
	abstract getDataDirectory(): string;

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

	/**
	 * Returns a list of account providers from all plugins.
	 * @returns {AccountProviderShape[]} An array of AccountProviderShape objects.
	 */
	abstract getAccountProviders(): AccountProviderShape[];

	/**
	 * Retrieves a specific account provider by its ID.
	 * @param id The ID of the account provider to retrieve.
	 * @return {AccountProviderShape} The AccountProviderShape object representing the account provider.
	 * @throws {Error} If the account provider with the specified ID does not exist.
	 */
	abstract getAccountProvider(id: string): AccountProviderShape;
}
