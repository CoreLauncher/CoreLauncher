import Transport from "./Transport";

export default class WebsocketTransport extends Transport {
	connection: WebSocket | null = null;

	/**
	 * Connect to the given endpoint
	 * @param endpoint hostname and port of the endpoint
	 */
	connect(endpoint: string) {
		console.info("[steam-client] Connecting to", endpoint);

		this.connection = new WebSocket(`wss://${endpoint}/cmsocket/`);

		this.connection.addEventListener("open", () => {
			this.emit("connected");
			console.info("[steam-client] Connected to WebSocket");
		});

		this.connection.addEventListener("close", () => {
			// this.emit("disconnected");
			console.info("[steam-client] Disconnected from WebSocket");
		});

		this.connection.addEventListener("error", (error) => {
			console.error("[steam-client] WebSocket error", error);
			// this.emit("error", error);
		});

		this.connection.addEventListener("message", (event) => {
			this.handleMessage(event.data as Buffer);
		});
	}

	protected rawSend(data: Buffer) {
		if (!this.connection || this.connection.readyState !== WebSocket.OPEN)
			return console.warn(`WebSocket is not connected, cannot send message.`);

		this.connection.send(data);
	}
}
