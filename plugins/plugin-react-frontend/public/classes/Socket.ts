import { TypedEmitter } from "@corelauncher/typed-emitter";
import type {
	Message,
	MessageType,
	MessageTypeMap,
} from "../../types/messages";

interface EventsEvents {
	message: (type: MessageType, data: Message) => void;
}

export default class Socket extends TypedEmitter<EventsEvents> {
	static get instance() {
		if (!Socket._instance) Socket._instance = new Socket();
		return Socket._instance;
	}

	private static _instance: Socket | null = null;
	private ws: WebSocket | null = null;
	constructor() {
		super();
		this.connect();
	}

	private connect() {
		this.ws = new WebSocket("/socket");
		this.ws.addEventListener("message", (event) => {
			const message = JSON.parse(event.data);
			this.emit("message", message.type, message.data);
			console.info(`Received message ${message.type}:`, message.data);
		});

		this.ws.addEventListener("open", () => console.info("Socket connected"));
		this.ws.addEventListener("close", () => {
			console.info("Socket disconnected");
			setTimeout(() => this.connect(), 1000);
		});
	}

	/**
	 *
	 * @param type message type
	 * @param data data to send
	 */
	send<Type extends MessageType>(type: Type, data: MessageTypeMap[Type]) {
		console.info(`Sending message ${type}:`, data);
		const stringified = JSON.stringify({ type, data });
		if (!this.ws) throw new Error("WebSocket is not connected");
		this.ws.send(stringified);
	}
}
