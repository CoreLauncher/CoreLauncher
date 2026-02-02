import { AccountInstanceShape } from "@corelauncher/sdk";
import { live, xnet } from "@xboxreplay/xboxlive-auth";
import type { Kysely } from "kysely";
import {
	CLIENT_ID,
	MINECRAFT_LOGIN_URL,
	MINECRAFT_PROFILE_URL,
	REDIRECT_URI,
	SCOPE,
} from "../constants";
import type { Database } from "../types/database";

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

interface MinecraftAccountInstanceEvents {
	disconnect: () => void;
}

export default class MinecraftAccountInstance extends AccountInstanceShape<MinecraftAccountInstanceEvents> {
	static async fromCode(database: Kysely<Database>, code: string) {
		const liveResult = await live.exchangeCodeForAccessToken(
			code,
			CLIENT_ID,
			SCOPE.join(" "),
			REDIRECT_URI,
		);

		const profileResult = await retrieveMinecraftProfile(
			liveResult.access_token,
		);

		return new MinecraftAccountInstance(database, {
			id: profileResult.id,
			name: profileResult.username,
			accessToken: liveResult.access_token,
			refreshToken: liveResult.refresh_token!,
			expiresAt: Date.now() + liveResult.expires_in * 1000,
		});
	}

	static async fromDatabase(
		database: Kysely<Database>,
		data: MinecraftProfile,
	) {
		return new MinecraftAccountInstance(database, data);
	}

	provider = "minecraft";

	private database: Kysely<Database>;
	private data: MinecraftProfile;

	constructor(database: Kysely<Database>, data: MinecraftProfile) {
		super();

		this.database = database;
		this.data = data;
	}

	get id() {
		return `minecraft:${this.data.id}`;
	}

	get rawId() {
		return this.data.id;
	}

	get name() {
		return this.data.name;
	}

	get avatarUrl() {
		return `https://api.mineatar.io/face/${this.data.id}?scale=32`;
	}

	disconnect() {
		this.emit("disconnect");
	}

	private async refresh() {
		if (Date.now() < this.data.expiresAt - 5 * 60 * 1000)
			return console.log("Access token is still valid, no need to refresh.");

		const liveResult = await live.refreshAccessToken(
			this.data.refreshToken,
			CLIENT_ID,
			SCOPE.join(" "),
		);

		this.data.accessToken = liveResult.access_token;
		this.data.refreshToken = liveResult.refresh_token!;
		this.data.expiresAt = Date.now() + liveResult.expires_in * 1000;
		await this.save();
	}

	async fetchProfile() {
		await this.refresh();
		return await retrieveMinecraftProfile(this.data.accessToken);
	}

	async save() {
		await this.database
			.updateTable("accounts")
			.where("id", "==", this.data.id)
			.set({
				name: this.data.name,
				accessToken: this.data.accessToken,
				refreshToken: this.data.refreshToken,
				expiresAt: this.data.expiresAt,
			})
			.execute();
	}

	/**
	 * Exports all the data required to save
	 * @returns save data
	 */
	export() {
		return this.data;
	}
}
