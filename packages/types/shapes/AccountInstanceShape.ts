import {
	type DefaultListener,
	type ListenerSignature,
	TypedEmitter,
} from "@corelauncher/typed-emitter";

export abstract class AccountInstanceShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<L> {
	abstract id: string;
	abstract name: string;
	abstract providerId: string;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			providerId: this.providerId,
		};
	}
}
