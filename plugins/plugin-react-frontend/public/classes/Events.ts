import type { JSONValue } from "@corelauncher/json-value";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { AccountInstance, AccountProvider, Game } from "../types";

interface EventsEvents {
	ready: () => void;
	games: (games: Game[]) => void;
	account_providers: (accountProviders: AccountProvider[]) => void;
	account_instances: (accountInstances: AccountInstance[]) => void;
}

export default class Events extends TypedEmitter<EventsEvents> {
	private static instance: Events | null = null;
	private ws: WebSocket;
	private values: Record<string, JSONValue> = {};
	constructor() {
		super();

		this.ws = new WebSocket("/api/events");
		this.ws.addEventListener("message", (event) => {
			const message = JSON.parse(event.data);
			this.values[message.type] = message.data;
			this.emit(message.type, message.data);
		});
	}

	static getInstance(): Events {
		if (!Events.instance) Events.instance = new Events();
		return Events.instance;
	}

	getValue<Type extends JSONValue>(event: string): Type | undefined {
		return this.values[event] as Type | undefined;
	}
}
