import { TypedEmitter } from "@corelauncher/typed-emitter";
import { gunzipSync } from "bun";
import ByteBuffer from "bytebuffer";
import { pEvent } from "p-event";
import { EMsg } from "../../protobuf/generated/enums_clientserver";
import {
	type CMsgMulti,
	CMsgProtoBufHeader,
	type CMsgProtoBufHeader as TCMsgProtoBufHeader,
} from "../../protobuf/generated/steammessages_base";
import type { CMsgClientLogonResponse } from "../../protobuf/generated/steammessages_clientserver_login";
import { PROTOBUF_MESSAGES } from "../../protobuf/messages";
import getMessageName from "../../util/get-message-name";
import type { SteamClient } from "../SteamClient";

const MESSAGE_TYPE_MASK = 0x80000000;

interface TransportEvents {
	connected: () => void;
	message: (message: Message) => void;
}

type Message = {
	type: EMsg;
	header: TCMsgProtoBufHeader;
	body: ProtoType<ProtoFactories>;
};

type JobCallback = (response: Message) => void;

type ProtoMessageIds = keyof typeof PROTOBUF_MESSAGES;

type ProtoFactories = (typeof PROTOBUF_MESSAGES)[ProtoMessageIds];

type ProtoType<Factory extends ProtoFactories> = ReturnType<Factory["decode"]>;

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
			if (!message.header.clientSessionid) return;
			this.sessionId = message.header.clientSessionid;
			if (this.heartbeat) clearInterval(this.heartbeat);
			this.heartbeat = setInterval(
				() => this.sendHeartbeat(),
				(body.heartbeatSeconds as number) * 1000,
			);
		});
	}

	private encodeProto<Proto extends ProtoFactories>(
		type: Proto,
		message: ProtoType<Proto>,
	): Buffer {
		// biome-ignore lint/suspicious/noExplicitAny: ProtoType is already constrained to valid types
		const data = type.encode(message as any).finish();
		const buffer = Buffer.from(data);
		return buffer;
	}

	protected decodeProto<Proto extends ProtoFactories>(
		type: Proto,
		data: Buffer,
	): ProtoType<Proto> {
		// The concrete decode() return types vary between protobuf factories and
		// can produce union-type inference issues when used in generic/union
		// contexts. Cast through any to avoid those diagnostic errors while still
		// preserving the expected return type for callers.
		// biome-ignore lint/suspicious/noExplicitAny: Read above
		return (type.decode as any)(data) as ProtoType<Proto>;
	}

	/**
	 * Encodes a message to be sent over the transport
	 * @param type message type (EMsg)
	 * @param body message body
	 * @param options.jobId optional job ID for the message
	 * @returns encoded message
	 */
	encodeMessage<Type extends ProtoMessageIds & number>(
		type: Type,
		body: ProtoType<(typeof PROTOBUF_MESSAGES)[Type]>,
		options: {
			jobId?: number;
		} = {},
	) {
		if (!(type in PROTOBUF_MESSAGES))
			throw new Error(`Message type ${type} not found in PROTOBUF_FACTORIES`);

		const proto = PROTOBUF_MESSAGES[type];
		const message = this.encodeProto(proto, body);
		const header = this.encodeProto(CMsgProtoBufHeader, {
			clientSessionid: this.sessionId,
			steamid: Number(this.client.token.id),
			jobidSource: options.jobId,
			// jobidTarget: 18446744073709551615,
			excludeClientSessionids: [],
			forwardToSysid: [],
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
	 * Decodes a message received over the transport
	 * @param message message buffer
	 * @returns decoded message or null if not a protobuf message
	 */
	private decodeMessage(message: Buffer) {
		const rawType = message.readUInt32LE(0);
		const type = rawType & ~MESSAGE_TYPE_MASK;
		const isProto = !!(rawType & MESSAGE_TYPE_MASK);
		if (!isProto) return null;

		const headerLength = message.readUInt32LE(4);
		const headerData = message.subarray(8, 8 + headerLength);
		const header = CMsgProtoBufHeader.decode(headerData);

		const bodyData = message.subarray(8 + headerLength);
		let bodyProto: ProtoFactories | null = null;

		if (bodyData.length === 0) {
			// There is no data to parse
			return { type, header, body: {} };
		} else if (type in PROTOBUF_MESSAGES) {
			bodyProto = PROTOBUF_MESSAGES[type as keyof typeof PROTOBUF_MESSAGES];
		} else if ([EMsg.k_EMsgServiceMethod].includes(type)) {
			const proto =
				PROTOBUF_MESSAGES[
					header.targetJobName as unknown as keyof typeof PROTOBUF_MESSAGES
				];
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

		const body = bodyProto.decode(bodyData);
		return { type, header, body };
	}

	/**
	 * Handles an incoming message buffer
	 * @param message message buffer
	 */
	protected handleMessage(message: Buffer) {
		const decoded = this.decodeMessage(message);
		if (!decoded) return;
		const { type, header, body } = decoded;

		if (type === EMsg.k_EMsgMulti) {
			const data = body as CMsgMulti;
			if (!data.messageBody) throw new Error("CMsgMulti has no messageBody");
			let buffer = data.messageBody;
			if (data.sizeUnzipped) {
				buffer = Buffer.from(gunzipSync(new Uint8Array(buffer)));
				if (buffer.length !== data.sizeUnzipped)
					throw new Error(
						`Decompressed size mismatch: expected ${data.sizeUnzipped}, got ${buffer.length}`,
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

		console.log({ type: getMessageName(type), header, body });
		this.emit("message", { type, header, body: body } as Message);
	}

	protected abstract rawSend(data: Buffer): void;

	/**
	 * Sends a message over the transport
	 * @param type message type (EMsg)
	 * @param body message body
	 */
	async send<Type extends ProtoMessageIds & number>(
		type: Type,
		body: ProtoType<(typeof PROTOBUF_MESSAGES)[Type]>,
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
