import { TypedEmitter } from "tiny-typed-emitter";
import type { AccountInstanceShape } from "../shapes/AccountInstanceShape";
import type { AccountProviderShape } from "../shapes/AccountProviderShape";
import type { GameShape } from "../shapes/GameShape";

interface PluginPortalEvents {
	/**
	 * A plugin has emitted the ready signal.
	 */
	ready: () => void;

	/**
	 * The list of registered games has changed.
	 * @param games The updated list of games.
	 */
	games: (games: GameShape[]) => void;

	/**
	 * The list of registered account providers has changed.
	 * @param providers The updated list of account providers.
	 */
	account_providers: (providers: AccountProviderShape[]) => void;

	/**
	 * The list of account instances has changed.
	 * @param instances The updated list of account instances.
	 */
	account_instances: (instances: AccountInstanceShape[]) => void;
}

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export abstract class PluginPortal extends TypedEmitter<PluginPortalEvents> {
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
