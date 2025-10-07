import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { ClassProperties } from "@corelauncher/types";
import { MESSAGES } from "./Messages";

interface TransportEvents {
	connected: () => void;
}

/**
 * Base transport class
 */
export default class Transport extends TypedEmitter<TransportEvents> {
	encodeMessage<Type extends keyof typeof MESSAGES>(
		type: Type,
		properties: ClassProperties<InstanceType<(typeof MESSAGES)[Type]>>,
	) {
		if (!(type in MESSAGES))
			throw new Error(`Message type ${type} not found in MESSAGES`);
		const MessageClass = MESSAGES[type];
		const message = MessageClass.create(properties);
		const encoded = MessageClass.encode(message).finish();
		return encoded;
	}
}
