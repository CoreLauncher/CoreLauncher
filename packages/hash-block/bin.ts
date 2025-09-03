import { existsSync } from "node:fs";
import { join } from "node:path";
import { encodeHashes, generateHashes } from ".";

const file = Bun.argv[2];
if (!file) throw new Error("No file patht provided");
const resolved = join(process.cwd(), file);
if (!existsSync(resolved))
	throw new Error(`File path does not exist: ${resolved}`);

const hashes = await generateHashes(resolved);
const encoded = await encodeHashes(hashes);
console.log(encoded);
