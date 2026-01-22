import type {
	DefaultListener,
	ListenerSignature,
} from "@corelauncher/typed-emitter";
import { TypedEmitter } from "@corelauncher/typed-emitter";

export abstract class GameProviderShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<L> {
	abstract id: string;
	abstract name: string;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
		};
	}
}
