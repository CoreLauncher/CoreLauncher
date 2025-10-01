import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { AccountInstanceShape } from "@corelauncher/types";
import SteamClient from "../../../packages/steam-client/classes/SteamClient";

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
	providerId = "steam";

	id: string;
	name: string;
	client: SteamClient;
	constructor(data: {
		id: number;
		name: string;
		accessToken: string;
		refreshToken: string;
	}) {
		super();

		this.id = `steam:${data.id}`;
		this.name = data.name;

		this.client = new SteamClient();
	}
}
