import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { AccountInstanceShape } from "@corelauncher/types";

interface SteamAccountInstanceEvents {
	/**
	 * Emitted when a new refresh token is generated
	 * @param token The new refresh token
	 */
	refreshToken: (token: string) => void;
}

export default class SteamAccountInstance
	extends TypedEmitter<SteamAccountInstanceEvents>
	implements AccountInstanceShape
{
	id: string;
	name: string;
	providerId = "steam";
	constructor(data: {
		id: number;
		name: string;
		accessToken: string;
		refreshToken: string;
	}) {
		super();

		this.id = `steam:${data.id}`;
		this.name = data.name;
	}
}
