import { TypedEmitter } from "@corelauncher/typed-emitter";

interface TransportEvents {
	connected: () => void;
}

/**
 * Base transport class
 */
export default class Transport extends TypedEmitter<TransportEvents> {}
