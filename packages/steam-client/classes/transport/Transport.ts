import type { JSONPrimitive } from "@corelauncher/json-value";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { ClassProperties } from "@corelauncher/types";
import { gunzipSync } from "bun";
import ByteBuffer from "bytebuffer";
import { EMsg } from "../../protobuf/compiled";
import getMessageName from "../../util/getMessageName";
import { PROTOBUFFERS } from "./protobuffers";

const MESSAGE_TYPE_MASK = 0x80000000;

interface TransportEvents {
	connected: () => void;
	message: (message: {
		type: number;
		header: Record<string, JSONPrimitive>;
		body: Record<string, JSONPrimitive>;
	}) => void;
}

/**
 * Base transport class
 */
export default abstract class Transport extends TypedEmitter<TransportEvents> {
	heartbeat: NodeJS.Timeout | null;
	constructor() {
		super();
		this.heartbeat = null;

		this.on("message", (message) => {
			const { type, body } = message;
			if (type !== EMsg.k_EMsgClientLogOnResponse) return;
			console.log("Logged on, server time offset:", body);
			if (this.heartbeat) clearInterval(this.heartbeat);
			this.heartbeat = setInterval(
				() => this.sendHeartbeat(),
				(body.heartbeatSeconds as number) * 1000,
			);
		});
	}

	/**
	 * Encodes a message to be sent over the transport
	 * @param type message type (EMsg)
	 * @param properties message properties
	 * @returns encoded message
	 */
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

	/**
	 * Encodes a protobuf message
	 * @param proto protobuf class
	 * @param data message data
	 * @returns encoded message
	 */
	encodeProto<Proto extends (typeof PROTOBUFFERS)[keyof typeof PROTOBUFFERS]>(
		proto: Proto,
		data: Partial<ClassProperties<InstanceType<Proto>>>,
	) {
		return proto.encode(data).finish();
	}

	/**
	 * Decodes a message received over the transport
	 * @param message message buffer
	 * @returns decoded message or null if not a protobuf message
	 */
	decodeMessage(message: Buffer) {
		const rawType = message.readUInt32LE(0);
		const type = rawType & ~MESSAGE_TYPE_MASK;
		const isProto = !!(rawType & MESSAGE_TYPE_MASK);
		if (!isProto) return null;

		console.log("Decoding message type:", getMessageName(type), type);

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
		const body = this.decodeProto(
			PROTOBUFFERS[type as keyof typeof PROTOBUFFERS],
			bodyData,
		);

		return { type, header, body };
	}

	/**
	 * Decodes a protobuf message
	 * @param proto protobuf class
	 * @param data message data
	 * @returns decoded message
	 */
	decodeProto<Proto extends (typeof PROTOBUFFERS)[keyof typeof PROTOBUFFERS]>(
		proto: Proto,
		data: Buffer,
	) {
		return proto.decode(data).toJSON();
	}

	/**
	 * Handles an incoming message buffer
	 * @param message message buffer
	 */
	handleMessage(message: Buffer) {
		const decoded = this.decodeMessage(message);
		if (!decoded) return;
		const { type, header, body } = decoded;

		if (type === EMsg.k_EMsgMulti) {
			let buffer = Buffer.from(body.messageBody, "base64");
			if (body.sizeUnzipped) {
				buffer = Buffer.from(gunzipSync(buffer));
				if (buffer.length !== body.sizeUnzipped)
					throw new Error(
						`Decompressed size mismatch: expected ${body.sizeUnzipped}, got ${buffer.length}`,
					);
			}

			while (buffer.length > 0) {
				const size = buffer.readUInt32LE(0);
				const msg = buffer.subarray(4, size + 4);
				buffer = buffer.subarray(size + 4);
				this.handleMessage(msg);
			}
			return;
		}

		this.emit("message", { type, header, body });
	}

	abstract send<Type extends keyof typeof PROTOBUFFERS & number>(
		type: Type,
		properties: Partial<
			ClassProperties<InstanceType<(typeof PROTOBUFFERS)[Type]>>
		>,
	): void;

	sendHeartbeat() {
		this.send(EMsg.k_EMsgClientHeartBeat, {});
	}
}
