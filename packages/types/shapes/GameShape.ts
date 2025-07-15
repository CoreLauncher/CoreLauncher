export abstract class GameShape {
	abstract id: string;
	abstract name: string;

	/**
	 * Launches the game.
	 * @returns {boolean | string | Promise<boolean | string>} A boolean indicating success or a string failure message.
	 */
	abstract launch(): boolean | string | Promise<boolean | string>;
}
