import { AccountInstanceShape } from "@corelauncher/types";
import { live, xnet } from "@xboxreplay/xboxlive-auth";
import {
	CLIENT_ID,
	MINECRAFT_LOGIN_URL,
	MINECRAFT_PROFILE_URL,
	REDIRECT_URI,
	SCOPE,
} from "../constants";

type MinecraftProfile = {
	id: string;
	name: string;
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
};

async function retrieveMinecraftProfile(accessToken: string) {
	const xboxLiveResult = await xnet.exchangeRpsTicketForUserToken(
		accessToken,
		"d",
	);

	const xboxSecureResult = await xnet.exchangeTokenForXSTSToken(
		xboxLiveResult.Token,
		{
			XSTSRelyingParty: "rp://api.minecraftservices.com/",
			sandboxId: "RETAIL",
		},
	);

	const minecraftLoginResponse = await fetch(MINECRAFT_LOGIN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			identityToken: `XBL3.0 x=${xboxSecureResult.DisplayClaims.xui[0]!.uhs};${xboxSecureResult.Token}`,
		}),
	});

	const minecraftLoginResult = await minecraftLoginResponse.json();

	const minecraftProfileResponse = await fetch(MINECRAFT_PROFILE_URL, {
		headers: {
			Authorization: `Bearer ${minecraftLoginResult.access_token}`,
		},
	});

	const minecraftProfileResult = await minecraftProfileResponse.json();

	return {
		id: minecraftProfileResult.id as string,
		username: minecraftProfileResult.name as string,
		accessToken: minecraftLoginResult.access_token as string,
		expiryDate: Date.now() + minecraftLoginResult.expires_in * 1000,
	};
}

export default class MinecraftAccountInstance extends AccountInstanceShape {
	static async fromCode(code: string) {
		const liveResult = await live.exchangeCodeForAccessToken(
			code,
			CLIENT_ID,
			SCOPE.join(" "),
			REDIRECT_URI,
		);

		const profileResult = await retrieveMinecraftProfile(
			liveResult.access_token,
		);

		return new MinecraftAccountInstance({
			id: profileResult.id,
			name: profileResult.username,
			accessToken: liveResult.access_token,
			refreshToken: liveResult.refresh_token!,
			expiresAt: Date.now() + liveResult.expires_in * 1000,
		});
	}

	static async fromDatabase(data: MinecraftProfile) {
		return new MinecraftAccountInstance(data);
	}

	providerId = "minecraft";
	private data: MinecraftProfile;

	constructor(data: MinecraftProfile) {
		super();

		this.data = data;
	}

	get id() {
		return `minecraft:${this.data.id}`;
	}

	get name() {
		return this.data.name;
	}

	get avatarUrl() {
		return `https://api.mineatar.io/face/${this.data.id}?scale=32`;
	}

	/**
	 * Exports all the data required to save
	 * @returns save data
	 */
	export() {
		return this.data;
	}
}
