import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { ClassProperties } from "@corelauncher/types";
import { gunzipSync } from "bun";
import ByteBuffer from "bytebuffer";
import { pEvent } from "p-event";
import { type CMsgClientLogonResponse, EMsg } from "../../protobuf/compiled";
import getMessageName from "../../util/getMessageName";
import type { SteamClient } from "../SteamClient";
import { PROTOBUFFERS } from "./protobuffers";

const MESSAGE_TYPE_MASK = 0x80000000;

interface TransportEvents {
	connected: () => void;
	message: (message: Message) => void;
}

type Message = {
	type: keyof typeof PROTOBUFFERS | number;
	header: ClassProperties<
		InstanceType<(typeof PROTOBUFFERS)["CMsgProtoBufHeader"]>
	>;
	body: ClassProperties<
		InstanceType<(typeof PROTOBUFFERS)[keyof typeof PROTOBUFFERS]>
	>;
};

type JobCallback = (response: Message) => void;

/**
 * Base transport class
 */
export default abstract class Transport extends TypedEmitter<TransportEvents> {
	private client: SteamClient;
	private heartbeat: NodeJS.Timeout | null;

	/**
	 * Session ID for the client
	 */
	private sessionId = 0;

	/**
	 * Job ID counter for messages that require a response
	 */
	private job = 1;

	/**
	 * Stores pending job callbacks
	 */
	private jobs: Record<string, JobCallback> = {};
	constructor(client: SteamClient) {
		super();
		this.client = client;
		this.heartbeat = null;

		// this.on("message", (message) => {
		// console.log("Received", getMessageName(message.type));
		// });

		// Handle Job callbacks
		this.on("message", (message) => {
			const job = message.header.jobidTarget as number;
			if (!job) return;
			if (!this.jobs[job]) return;
			this.jobs[job](message);
		});

		// Start heartbeat on logon response
		this.on("message", (message) => {
			const type = message.type;
			const body = message.body as CMsgClientLogonResponse;
			if (type !== EMsg.k_EMsgClientLogOnResponse) return;
			if (!body.heartbeatSeconds) return;
			this.sessionId = message.header.clientSessionid;
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
	 * @param body message body
	 * @param options.jobId optional job ID for the message
	 * @returns encoded message
	 */
	encodeMessage<Type extends keyof typeof PROTOBUFFERS & number>(
		type: Type,
		body: Partial<ClassProperties<InstanceType<(typeof PROTOBUFFERS)[Type]>>>,
		options: {
			jobId?: number;
		} = {},
	) {
		if (!(type in PROTOBUFFERS))
			throw new Error(`Message type ${type} not found in PROTOBUFFERS`);

		const proto = PROTOBUFFERS[type];
		const message = this.encodeProto(proto, body);
		const header = this.encodeProto(PROTOBUFFERS.CMsgProtoBufHeader, {
			clientSessionid: this.sessionId,
			steamid: this.client.token.id as unknown as number,
			jobidSource: (options.jobId || -1) as unknown as number,
			jobidTarget: -1 as unknown as number,
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

		const headerLength = message.readUInt32LE(4);
		const headerData = message.subarray(8, 8 + headerLength);
		const header = this.decodeProto(
			PROTOBUFFERS.CMsgProtoBufHeader,
			headerData,
		);

		const bodyData = message.subarray(8 + headerLength);
		let bodyProto: (typeof PROTOBUFFERS)[keyof typeof PROTOBUFFERS] | null =
			null;

		if (bodyData.length === 0) {
			// There is no data to parse
			return { type, header, body: {} };
		} else if (type in PROTOBUFFERS) {
			bodyProto = PROTOBUFFERS[type as keyof typeof PROTOBUFFERS];
		} else if ([EMsg.k_EMsgServiceMethod].includes(type)) {
			const proto =
				PROTOBUFFERS[header.targetJobName as keyof typeof PROTOBUFFERS];
			if (!proto) {
				console.warn(
					`No protobuf found for service method ${header.targetJobName}`,
				);
				return null;
			}

			bodyProto = proto;
		} else {
			console.warn(
				`No protobuf found for message type ${type} (${getMessageName(type)})`,
			);
			return null;
		}

		const body = this.decodeProto(bodyProto, bodyData);
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

		// console.log({ type, header, body });
		this.emit("message", { type, header, body: body } as Message);
	}

	protected abstract rawSend(data: Buffer): void;

	/**
	 * Sends a message over the transport
	 * @param type message type (EMsg)
	 * @param body message body
	 */
	async send<Type extends keyof typeof PROTOBUFFERS & number>(
		type: Type,
		body: Partial<ClassProperties<InstanceType<(typeof PROTOBUFFERS)[Type]>>>,
		options: {
			wait?: boolean;
			callback?: JobCallback;
		} = {},
	) {
		const job = options.wait || options.callback ? this.job++ : undefined;
		const encoded = this.encodeMessage(type, body, {
			jobId: job,
		});

		if (options.callback && job !== undefined)
			this.registerJobCallback(job, options.callback);

		this.rawSend(encoded);

		if (!options?.wait) return;

		const response = await pEvent(this, "message", {
			filter: (message: Message) => {
				return message.header.jobidTarget === job!;
			},
		});

		return response;
	}

	private sendHeartbeat() {
		this.send(EMsg.k_EMsgClientHeartBeat, {});
	}

	/**
	 * Registers a job callback
	 * @param id job ID
	 * @param callback callback function
	 * @param ttl time to live in milliseconds
	 */
	private registerJobCallback(
		id: number,
		callback: JobCallback,
		ttl = 2 * 60 * 1000,
	) {
		this.jobs[id] = callback;
		setTimeout(() => delete this.jobs[id], ttl);
	}
}
