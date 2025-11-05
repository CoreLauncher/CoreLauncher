import { EMsg } from "../protobuf/compiled";

export default function getMessageName(type: number | string) {
	if (typeof type === "string") return type;

	return Object.keys(EMsg)
		.find((key) => EMsg[key as keyof typeof EMsg] === type)
		?.slice(6);
}
