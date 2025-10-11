import {
	CMsgClientHello,
	CMsgClientLogon,
	CMsgProtoBufHeader,
	EMsg,
} from "../../protobuf/compiled";

export const PROTOBUFFERS = {
	[EMsg.k_EMsgClientHello]: CMsgClientHello,
	[EMsg.k_EMsgClientLogon]: CMsgClientLogon,

	CMsgProtoBufHeader: CMsgProtoBufHeader,
};
