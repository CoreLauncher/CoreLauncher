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
	private static _instance: Socket | null = null;
	private ws: WebSocket;
	constructor() {
		super();

		this.ws = new WebSocket("/socket");
		this.ws.addEventListener("message", (event) => {
			const message = JSON.parse(event.data);
			this.emit("message", message.type, message.data);
			console.info(`Received message ${message.type}:`, message.data);
		});

		this.ws.addEventListener("open", () => console.info("Socket connected"));
		this.ws.addEventListener("close", () =>
			console.info("Socket disconnected"),
		);
	}

	static get instance() {
		if (!Socket._instance) Socket._instance = new Socket();
		return Socket._instance;
	}

	/**
	 *
	 * @param type message type
	 * @param data data to send
	 */
	send<Type extends MessageType>(type: Type, data: MessageTypeMap[Type]) {
		console.info(`Sending message ${type}:`, data);
		const stringified = JSON.stringify({ type, data });
		this.ws.send(stringified);
	}
}
