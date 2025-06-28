import { join } from "node:path";

const flag = "//@ts-nocheck";
const file = join("node_modules", "webview-bun", "src", "ffi.ts");
const content = await Bun.file(file).text();

if (content.startsWith(flag)) process.exit(0);
const patchedContent = `${flag}\n${content}`;
await Bun.write(file, patchedContent);
