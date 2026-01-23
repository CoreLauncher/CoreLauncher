/** biome-ignore-all lint/suspicious/noExplicitAny: TBD */
import type { TypedEmitter } from "@corelauncher/typed-emitter";

export class BulkListener<E extends TypedEmitter, N extends string> {
	event: N;
	emitters: E[];
	listener: (emitter: E, ...args: any) => void;
	listeners: Map<E, (...args: any) => void>;
	constructor(event: N, listener: (emitter: E, ...args: any) => void) {
		this.event = event;
		this.emitters = [];
		this.listener = listener;
		this.listeners = new Map();
	}

	/**
	 * Listens for the specified event on all provided emitters.
	 * @param objects the emitters to attach te listeners to
	 */
	listen(emitters: E[]) {
		this.unlisten();
		this.emitters = emitters;
		for (const emitter of this.emitters) {
			const listener = (...args: any) => this.listener(emitter, ...args);
			this.listeners.set(emitter, listener);
			emitter.on(this.event, listener);
		}
	}

	/**
	 * Removes the listeners from all provided emitters.
	 */
	unlisten() {
		this.listeners.forEach((listener, emitter) => {
			emitter.off(this.event, listener);
		});
		this.listeners.clear();
		this.emitters = [];
	}
}
