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
	abstract avatarUrl?: string | null | undefined;

	/**
	 * Id of the AccountProvider that registered this instance
	 */
	abstract provider: string;

	/**
	 * Removes the account instance
	 */
	abstract disconnect(): void;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			avatarUrl: this.avatarUrl,
			provider: this.provider,
		};
	}
}
