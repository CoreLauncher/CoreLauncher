import type {
	DefaultListener,
	ListenerSignature,
} from "@corelauncher/typed-emitter";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { GameFeature } from "../enums/GameFeature";
import type { GameState } from "../enums/GameState";
import type { Option } from "../options";
import type { MaybePromise } from "../utility/MaybePromise";
import type { GameProfileShape } from "./GameProfileShape";

interface GameShapeEvents {
	state_changed: (newState: GameState, oldState: GameState) => void;
}

export abstract class GameInstanceShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<GameShapeEvents & L> {
	abstract id: string;
	abstract name: string;
	abstract features: GameFeature[];
	abstract state: GameState;
	abstract iconUrl: string | null;
	abstract bannerUrl: string | null;
	abstract capsuleUrl: string | null;

	/**
	 * Id of the GameProvider that registered this instance
	 */
	abstract provider: string;

	/**
	 * Launches the game.
	 * @returns {boolean | string | Promise<boolean | string>} A boolean indicating success or a string failure message.
	 */
	abstract launch(): MaybePromise<boolean | string>;

	/**
	 * Retrieves the profile creation options for this game.
	 * @param options current values
	 */
	abstract createProfileOptions(
		options: Record<string, string | number | boolean>,
	): MaybePromise<Option[]>;

	/**
	 * Creates a new profile for this game.
	 * @param name name of the profile
	 * @param options options for the profile
	 */
	abstract createProfile(
		name: string,
		options: Record<string, string | number | boolean>,
	): MaybePromise<GameProfileShape | undefined>;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			features: this.features,
			state: this.state,
			iconUrl: this.iconUrl,
			bannerUrl: this.bannerUrl,
			capsuleUrl: this.capsuleUrl,
			provider: this.provider,
		};
	}
}
