import type { JSONValue } from "@corelauncher/json-value";

declare module "binarykvparser" {
	export function parse(buffer: Buffer, offset?: number): JSONValue;
}
