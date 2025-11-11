export abstract class GameShape {
	abstract id: string;
	abstract name: string;
	abstract iconUrl: string | null;
	abstract bannerUrl: string | null;
	abstract capsuleUrl: string | null;

	/**
	 * Launches the game.
	 * @returns {boolean | string | Promise<boolean | string>} A boolean indicating success or a string failure message.
	 */
	abstract launch(): boolean | string | Promise<boolean | string>;
}
