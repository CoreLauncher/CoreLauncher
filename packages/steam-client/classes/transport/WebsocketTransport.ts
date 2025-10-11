import type { ClassProperties } from "@corelauncher/types";
import type { PROTOBUFFERS } from "./protobuffers";
import Transport from "./Transport";

export default class WebsocketTransport extends Transport {
	connection: WebSocket | null = null;

	connect(endpoint: string) {
		console.log("Connecting to", endpoint);

		this.connection = new WebSocket(`wss://${endpoint}/cmsocket/`);

		this.connection.addEventListener("open", () => {
			console.log("WebSocket connected");
			this.emit("connected");
		});

		this.connection.addEventListener("close", () => {
			console.log("WebSocket disconnected");
			// this.emit("disconnected");
		});

		this.connection.addEventListener("error", (error) => {
			console.error("WebSocket error", error);
			// this.emit("error", error);
		});

		this.connection.addEventListener("message", (event) => {
			console.log("WebSocket message", event.data);
		});
	}

	send<Type extends keyof typeof PROTOBUFFERS & number>(
		type: Type,
		properties: Partial<
			ClassProperties<InstanceType<(typeof PROTOBUFFERS)[Type]>>
		>,
	) {
		if (!this.connection || this.connection.readyState !== WebSocket.OPEN)
			throw new Error("WebSocket is not connected");
		const encoded = this.encodeMessage(type, properties);
		this.connection.send(encoded);
	}
}
