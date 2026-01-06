import type {
	DefaultListener,
	ListenerSignature,
} from "@corelauncher/typed-emitter";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { GameState } from "../enums/GameState";
import type { GameType } from "../enums/GameType";
import type { GameInstanceProviderShape } from "./GameInstanceProviderShape";

interface GameShapeEvents {
	state_changed: (newState: GameState, oldState: GameState) => void;
}

export abstract class GameShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<GameShapeEvents & L> {
	abstract id: string;
	abstract name: string;
	abstract type: GameType;
	abstract state: GameState;
	abstract iconUrl: string | null;
	abstract bannerUrl: string | null;
	abstract capsuleUrl: string | null;

	instanceProvider?: GameInstanceProviderShape | null;

	/**
	 * Launches the game.
	 * @returns {boolean | string | Promise<boolean | string>} A boolean indicating success or a string failure message.
	 */
	abstract launch(): boolean | string | Promise<boolean | string>;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			state: this.state,
			iconUrl: this.iconUrl,
			bannerUrl: this.bannerUrl,
			capsuleUrl: this.capsuleUrl,
		};
	}
}
