import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { GameState } from "../enums/GameState";
import type { AccountInstanceShape } from "../shapes/AccountInstanceShape";
import type { AccountProviderShape } from "../shapes/AccountProviderShape";
import type { GameShape } from "../shapes/GameShape";
import type { ShowDialogOptions } from "./ShowDialogOptions";

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

	game_state_changed: (
		game: GameShape,
		newState: GameState,
		oldState: GameState,
	) => void;

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

	/**
	 * This event emits when a second instance of the application is started.
	 * @param args The command line arguments.
	 */
	app_instance: (args: string[]) => void;

	/**
	 * This event emits when the application is launched via a protocol link.
	 * @param url The launched protocol URL.
	 */
	protocol_launch: (url: URL) => void;

	/**
	 * Another plugin is requesting to show a dialog.
	 * @param options The dialog options.
	 */
	show_dialog_request: (options: ShowDialogOptions) => void;

	/**
	 * Another plugin is requesting to close a dialog.
	 * @param options The dialog options.
	 */
	close_dialog_request: (options: { id: string }) => void;
}

/**
 * The PluginPortal class is a plugins way to access the resources from other plugins.
 */
export abstract class PluginPortal extends TypedEmitter<PluginPortalEvents> {
	/**
	 * Returns the command line arguments passed to the application.
	 * @returns {string[]} An array of command line arguments.
	 */
	abstract get arguments(): string[];

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

	/**
	 * Returns a list of account instances from all plugins.
	 * @returns {AccountInstanceShape[]} An array of AccountInstanceShape objects.
	 */
	abstract getAccountInstances(): AccountInstanceShape[];

	/**
	 *
	 * @param id The ID of the account instance to retrieve/
	 * @return {AccountInstanceShape} The AccountInstanceShape object representing the account instance.
	 * @throws {Error} If the account instance with the specified ID does not exist.
	 */
	abstract getAccountInstance(id: string): AccountInstanceShape;

	/**
	 * Shows a dialog to the user.
	 * @param options The dialog options.
	 */
	abstract showDialog(options: ShowDialogOptions): void;

	/**
	 * Closes a dialog.
	 * @param options The dialog options.
	 */
	abstract closeDialog(options: { id: string }): void;

	/**
	 * Exits the application.
	 */
	abstract exit(): void;
}
