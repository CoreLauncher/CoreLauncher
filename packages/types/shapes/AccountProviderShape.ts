import type {
	DefaultListener,
	ListenerSignature,
} from "@corelauncher/typed-emitter";
import { TypedEmitter } from "@corelauncher/typed-emitter";

export abstract class AccountProviderShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<L> {
	abstract id: string;
	abstract name: string;
	abstract color: string;
	abstract logoUrl: string;

	/**
	 * Connects the account provider.
	 * @returns {boolean | string | Promise<boolean | string>} A boolean indicating success or a string failure message.
	 */
	abstract connect(): boolean | string | Promise<boolean | string>;

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			color: this.color,
			logoUrl: this.logoUrl,
		};
	}
}
