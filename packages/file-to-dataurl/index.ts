import { readFileSync } from "node:fs";

export function fileToDataURL(path: string) {
	const file = Bun.file(path);
	const content = readFileSync(path, "utf-8");

	return dataToDataURL(content, file.type.split(";")[0]!);
}

export function dataToDataURL(data: string, type: string) {
	return `data:${type};base64,${Buffer.from(data).toString("base64")}`;
}
