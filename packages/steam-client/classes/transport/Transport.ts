import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { ClassProperties } from "@corelauncher/types";
import { deflateSync, gunzipSync, inflateSync } from "bun";
import ByteBuffer from "bytebuffer";
import { EMsg } from "../../protobuf/compiled";
import { PROTOBUFFERS } from "./protobuffers";

const MESSAGE_TYPE_MASK = 0x80000000;

interface TransportEvents {
	connected: () => void;
}

/**
 * Base transport class
 */
export default class Transport extends TypedEmitter<TransportEvents> {
	encodeMessage<Type extends keyof typeof PROTOBUFFERS & number>(
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
			steamid: "76561199013332465" as unknown as number,
			jobidSource: "18446744073709551615" as unknown as number,
			jobidTarget: "18446744073709551615" as unknown as number,
		});

		const buffer = new ByteBuffer(
			4 + 4 + header.length,
			ByteBuffer.LITTLE_ENDIAN,
		);
		buffer.writeUint32(type | MESSAGE_TYPE_MASK);
		buffer.writeUint32(header.length);
		buffer.append(header);

		return Buffer.concat([buffer.flip().toBuffer(), message]);
	}

	encodeProto<Proto extends (typeof PROTOBUFFERS)[keyof typeof PROTOBUFFERS]>(
		proto: Proto,
		data: Partial<ClassProperties<InstanceType<Proto>>>,
	) {
		return proto.encode(data).finish();
	}

	decodeMessage(message: Buffer) {
		const rawType = message.readUInt32LE(0);
		const type = rawType & ~MESSAGE_TYPE_MASK;
		const isProto = !!(rawType & MESSAGE_TYPE_MASK);

		console.log("Message type:", type);
		console.log("Is Proto:", isProto);

		if (!isProto) return null;

		const headerLength = message.readUInt32LE(4);
		const headerData = message.subarray(8, 8 + headerLength);
		const header = this.decodeProto(
			PROTOBUFFERS.CMsgProtoBufHeader,
			headerData,
		);

		const bodyData = message.subarray(8 + headerLength);
		if (bodyData.length === 0) return { type, header, body: {} };
		if (!PROTOBUFFERS[type as keyof typeof PROTOBUFFERS])
			throw new Error(`No proto found for message type ${type}`);
		// if (type !== 1) return { type, header, body: {} };
		const body = this.decodeProto(
			PROTOBUFFERS[type as keyof typeof PROTOBUFFERS],
			bodyData,
		);

		console.log("Header data length:", headerData.length);
		console.log("Body data length:", bodyData.length);

		// console.log("Header:", header);
		// console.log("Body:", body);

		return { type, header, body };
	}

	decodeProto<Proto extends (typeof PROTOBUFFERS)[keyof typeof PROTOBUFFERS]>(
		proto: Proto,
		data: Buffer,
	) {
		console.log("Decoding proto", proto);
		return proto.decode(data).toJSON();
	}

	handleMessage(message: Buffer) {
		const decoded = this.decodeMessage(message);
		if (!decoded) return;
		const { type, header, body } = decoded;

		if (type === EMsg.k_EMsgMulti) {
			let buffer = Buffer.from(body.messageBody, "base64");
			if (body.sizeUnzipped) {
				console.log(buffer);
				buffer = Buffer.from(gunzipSync(buffer));
				if (buffer.length !== body.sizeUnzipped)
					throw new Error(
						`Decompressed size mismatch: expected ${body.sizeUnzipped}, got ${buffer.length}`,
					);
			}

			while (buffer.length > 0) {
				console.log("Remaining buffer length:", buffer.length);
				const size = buffer.readUInt32LE(0);
				console.log("Next message size:", size);
				const msg = buffer.subarray(4, size + 4);
				buffer = buffer.subarray(size + 4);

				this.decodeMessage(msg);
			}

			console.log(buffer);
		}
	}
}
