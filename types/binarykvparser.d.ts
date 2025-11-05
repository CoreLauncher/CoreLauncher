declare module "binarykvparser" {
	import type { JSONValue } from "@corelauncher/json-value";
	export function parse(buffer: Buffer, offset?: number): JSONValue;
}
