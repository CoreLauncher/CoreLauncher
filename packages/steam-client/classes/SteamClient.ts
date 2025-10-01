import SteamAPI from "./SteamAPI";
import WebsocketTransport from "./transport/WebsocketTransport";

export class SteamClient {
	api: SteamAPI;
	transport: WebsocketTransport;
	constructor() {
		this.api = new SteamAPI();
		this.transport = new WebsocketTransport();

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
