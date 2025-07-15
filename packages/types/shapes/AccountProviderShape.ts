export abstract class AccountProviderShape {
	abstract id: string;
	abstract name: string;
	abstract color: string;
	abstract logo: string;

	/**
	 * Connects the account provider.
	 * @returns {boolean | string | Promise<boolean | string>} A boolean indicating success or a string failure message.
	 */
	abstract connect(): boolean | string | Promise<boolean | string>;
}
