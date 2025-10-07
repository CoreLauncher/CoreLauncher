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

		this.transport.on("connected", () => {
			this.transport.send(EMsg.k_EMsgClientHello, {
				protocolVersion: 65576,
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
