import { isProduction } from "@corelauncher/is-production";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { ServerWebSocket } from "bun";
import getPort from "get-port";
import indexHTML from "../public/index.html";
import type { Message, MessageType, MessageTypeMap } from "../types/messages";

const port = await getPort({ port: isProduction ? undefined : 3000 });

interface ServerEvents {
	connected: () => void;
	message: (type: MessageType, data: Message) => void;
}

export default class Server extends TypedEmitter<ServerEvents> {
	private port: number;
	private server: Bun.Server<undefined>;
	private state: Record<string, string> = {};
	constructor() {
		super();

		console.info(`Starting internal server on http://localhost:${port}`);
		this.port = port;
		this.server = Bun.serve({
			port,
			hostname: "localhost",
			development: {
				hmr: isProduction,
				console: isProduction,
			},
			websocket: {
				open: (ws: ServerWebSocket<never>) => {
					ws.subscribe("socket");

					// Send all previously published data to the newly connected client
					// We use a slight delay to ensure the client is ready to receive messages
					// Was previously an issue on webkitgtk
					setTimeout(() => {
						for (const event in this.state) {
							ws.send(this.state[event]!);
						}
					}, 10);
				},
				message: (_, message: string) => {
					const { type, data } = JSON.parse(message);
					this.emit("message", type, data);
				},
			},
			routes: {
				"/": indexHTML,
				"/socket": (request) => {
					this.server.upgrade(request);
				},
			},
		});
	}

	get url() {
		return `http://localhost:${this.port}`;
	}

	/**
	 *
	 * @param type message type
	 * @param data data to send
	 * @param state indicates if the message is part of the app state and should be restored on reconnect
	 */
	send<Type extends MessageType>(
		type: Type,
		data: MessageTypeMap[Type],
		state?: boolean,
	) {
		const stringified = JSON.stringify({ type, data });
		if (state) this.state[type] = stringified;
		this.server.publish("socket", stringified);
	}
}
