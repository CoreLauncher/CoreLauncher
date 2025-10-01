const USER_AGENT = "Valve/Steam HTTP Client 1.0";
const HOSTNAME = "api.steampowered.com";

interface SteamTypes {
	ISteamDirectory: {
		GetCMListForConnect: {
			GET: {
				"1": {
					Parameters: {
						maxcount: number;
						cmtype: "websockets";
					};
					Response: {
						serverlist: {
							endpoint: string;
							legacy_endpoint: string;
							type: "websockets";
							dc: string;
							realm: string;
							load: number;
							wtd_load: string;
						}[];
					};
				};
			};
		};
	};
}

type SteamParameters<T> = T extends { Parameters: infer P }
	? P
	: Record<string, unknown>;
type SteamResponse<T> = T extends { Response: infer R } ? R : never;

export default class SteamAPI {
	async fetch<
		SteamInterface extends keyof SteamTypes,
		SteamMethod extends keyof SteamTypes[SteamInterface],
		Method extends keyof SteamTypes[SteamInterface][SteamMethod],
		SteamVersion extends keyof SteamTypes[SteamInterface][SteamMethod][Method],
	>(
		method: Method = "GET" as Method,
		steamInterface: SteamInterface,
		steamMethod: SteamMethod,
		steamVersion: SteamVersion = "1" as SteamVersion,
		data: SteamParameters<
			SteamTypes[SteamInterface][SteamMethod][Method][SteamVersion]
		> = {} as SteamParameters<
			SteamTypes[SteamInterface][SteamMethod][Method][SteamVersion]
		>,
	): Promise<
		SteamResponse<SteamTypes[SteamInterface][SteamMethod][Method][SteamVersion]>
	> {
		if (
			typeof method !== "string" ||
			typeof steamInterface !== "string" ||
			typeof steamMethod !== "string" ||
			typeof steamVersion !== "string"
		) {
			throw new Error("Invalid parameters");
		}

		const url = `https://${HOSTNAME}/${steamInterface}/${steamMethod}/v${steamVersion}/?${new URLSearchParams(data as Record<string, string>).toString()}`;
		const response = await fetch(url, {
			method,
			headers: {
				"User-Agent": USER_AGENT,
			},
		});

		const output = await response.json();
		return output.response;
	}
}
