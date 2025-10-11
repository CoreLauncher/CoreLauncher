import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { ClassProperties } from "@corelauncher/types";
import ByteBuffer from "bytebuffer";
import { PROTOBUFFERS } from "./protobuffers";

interface TransportEvents {
	connected: () => void;
}

/**
 * Base transport class
 */
export default class Transport extends TypedEmitter<TransportEvents> {
	encodeMessage<Type extends keyof typeof PROTOBUFFERS>(
		type: Type,
		properties: Partial<
			ClassProperties<InstanceType<(typeof PROTOBUFFERS)[Type]>>
		>,
	) {
		if (!(type in PROTOBUFFERS))
			throw new Error(`Message type ${type} not found in PROTOBUFFERS`);

		const proto = PROTOBUFFERS[type];
		const message = this.encodeProto(proto, properties);
		const header = this.encodeProto(PROTOBUFFERS.CMsgProtoBufHeader, {
			clientSessionid: 0,
			steamid: "76561199013332465",
			jobidSource: "18446744073709551615",
			jobidTarget: "18446744073709551615",
		});

		const buffer = new ByteBuffer(
			4 + 4 + header.length,
			ByteBuffer.LITTLE_ENDIAN,
		);
		buffer.writeUint32((type as number) | 0x80000000);
		buffer.writeUint32(header.length);
		buffer.append(header);

		return Buffer.concat([buffer.flip().toBuffer(), message]);
	}

	encodeProto(
		proto: (typeof PROTOBUFFERS)[keyof typeof PROTOBUFFERS],
		data: { [key: string]: any },
	) {
		return proto.encode(data).finish();
	}
}
