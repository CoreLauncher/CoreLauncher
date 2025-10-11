import { EMsg } from "../protobuf/compiled";
import SteamAPI from "./SteamAPI";
import WebsocketTransport from "./transport/WebsocketTransport";

type SteamClientOptions = {
	refreshToken: string;
};

export class SteamClient {
	api: SteamAPI;
	transport: WebsocketTransport;
	constructor(options: SteamClientOptions) {
		this.api = new SteamAPI();
		this.transport = new WebsocketTransport();

		console.log("Connecting to Steam...");

		this.transport.on("connected", () => {
			this.transport.send(EMsg.k_EMsgClientLogon, {
				shouldRememberPassword: true,
				obfuscatedPrivateIp: { v4: 0 },
				protocolVersion: 65580,
				supportsRateLimitResponse: true,
				machineName: "",
				clientLanguage: "english",
				clientOsType: 16,
				chatMode: 2,
				accessToken: options.refreshToken,
				cellId: 15,
				// machineId: "",
			});
		});

		this.api
			.fetch("GET", "ISteamDirectory", "GetCMListForConnect", "1", {
				cmtype: "websockets",
				maxcount: 10,
			})
			.then((response) => {
				const endpoint = response.serverlist[0]?.endpoint;
				if (!endpoint) throw new Error("No endpoint found");

				this.transport.connect(endpoint);
			});
	}
}
