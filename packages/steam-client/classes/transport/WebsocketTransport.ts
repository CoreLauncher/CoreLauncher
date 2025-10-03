import Transport from "./Transport";

export default class WebsocketTransport extends Transport {
	connection: WebSocket | null = null;
	constructor() {
		super();
	}

	connect(endpoint: string) {
		console.log("Connecting to", endpoint);

		this.connection = new WebSocket(`wss://${endpoint}/`);

		this.connection.addEventListener("open", () => {
			console.log("WebSocket connected");
			this.emit("connected");
		});

		this.connection.addEventListener("message", (event) => {
			console.log("WebSocket message", event.data);
		});
	}
}
