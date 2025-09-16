import "@corelauncher/console-addon";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { argv } from "bun";
import { encodeHashes, generateHashes } from ".";

const inputFile = argv[2];
const outputFile = argv[3];

console.info("Input file:", inputFile);
console.info("Output file:", outputFile);

if (!inputFile) throw new Error("No input file path provided");
if (!outputFile) throw new Error("No output file path provided");

const resolved = join(process.cwd(), inputFile);
if (!existsSync(resolved))
	throw new Error(`File path does not exist: ${resolved}`);

console.info(`Generating hashes...`);

const hashes = await generateHashes(resolved);
const encoded = await encodeHashes(hashes);

console.info(`Writing ${hashes.length} hashes to ${outputFile}`);
await Bun.write(outputFile, encoded);
console.info("Done!");
