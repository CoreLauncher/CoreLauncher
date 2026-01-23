import type {
	DefaultListener,
	ListenerSignature,
} from "@corelauncher/typed-emitter";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { MaybePromise } from "../utility/MaybePromise";

export abstract class GameProfileShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<L> {
	abstract id: string;
	abstract name: string;
	abstract subname?: string;

	abstract game: string;

	abstract launch(): MaybePromise<boolean | string>;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			subname: this.subname,
			game: this.game,
		};
	}
}
