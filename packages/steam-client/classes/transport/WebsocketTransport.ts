import Transport from "./Transport";

export default class WebsocketTransport extends Transport {
	constructor() {
		super();
	}

	connect(endpoint: string) {
		console.log("Connecting to", endpoint);
	}
}
