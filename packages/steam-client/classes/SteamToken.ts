import { jwtDecode } from "jwt-decode";

type SteamTokenData = {
	/**
	 * The issuer of the token, usually "steam".
	 */
	iss: "steam" | string;

	/**
	 * The subject of the token, usually the SteamID of the user.
	 */
	sub: string;

	/**
	 * The audience of the token, usually an array of strings representing the services that can accept the token.
	 */
	aud: string[];

	/**
	 * The expiration time of the token, represented as a Unix timestamp.
	 */
	exp: number;

	/**
	 * The time the token is valid from, represented as a Unix timestamp.
	 */
	nbf: number;

	/**
	 * The time the token was issued, represented as a Unix timestamp.
	 */
	iat: number;

	/**
	 * The unique identifier for the token.
	 */
	jti: string;

	/**
	 * ???
	 */
	oat: number;

	/**
	 * ???
	 */
	per: number;

	/**
	 * The ip address the token was issued to.
	 */
	ip_subject: string;

	/**
	 * The ip address the token was confirmed from.
	 */
	ip_confirmer: string;
};

export default class SteamToken {
	token: string;
	data: SteamTokenData;
	constructor(token: string) {
		this.token = token;
		this.data = jwtDecode(token) as SteamTokenData;
	}

	/**
	 * Checks if the token is expired
	 * @returns if the token is expired
	 */
	isExpired() {
		return Date.now() >= this.data.exp * 1000;
	}

	/**
	 * The SteamID of the user this token belongs to
	 */
	get id() {
		return this.data.sub;
	}
}
