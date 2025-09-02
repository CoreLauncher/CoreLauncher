import { createReadStream } from "node:fs";
import { pEvent } from "p-event";

type Range = {
	start: number;
	end: number;
};

type RangedHash = {
	hash: bigint;
} & Range;

export async function generateHashes(file: string) {
	const stream = createReadStream(file, { highWaterMark: 1024 * 8 });
	const hashes: RangedHash[] = [];
	let index = 0;

	stream.on("data", (chunk) => {
		const start = index;
		const end = index + chunk.length;
		const hash = Bun.hash(chunk) as bigint;
		index = end;

		hashes.push({ start, end, hash });
		console.log(start, end, chunk.length, hash);
	});

	await pEvent(stream, "end");

	return hashes;
}

export async function encodeHashes(hashes: RangedHash[]) {
	const lines: Buffer[] = [];

	for (const { start, end, hash } of hashes) {
		const buffer = Buffer.allocUnsafe(24);
		buffer.writeBigUInt64LE(BigInt(start), 0);
		buffer.writeBigUInt64LE(BigInt(end), 8);
		buffer.writeBigUInt64LE(hash, 16);
		lines.push(buffer);
	}

	const buffer = Buffer.concat(lines);
	const compressed = Bun.gzipSync(buffer);
	return compressed;
}
