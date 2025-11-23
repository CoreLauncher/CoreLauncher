import type { GameStatus } from "../enums/GameStatus";

export abstract class GameShape {
	abstract id: string;
	abstract name: string;
	abstract status: GameStatus;
	abstract iconUrl: string | null;
	abstract bannerUrl: string | null;
	abstract capsuleUrl: string | null;

	/**
	 * Launches the game.
	 * @returns {boolean | string | Promise<boolean | string>} A boolean indicating success or a string failure message.
	 */
	abstract launch(): boolean | string | Promise<boolean | string>;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			status: this.status,
			iconUrl: this.iconUrl,
			bannerUrl: this.bannerUrl,
			capsuleUrl: this.capsuleUrl,
		};
	}
}
