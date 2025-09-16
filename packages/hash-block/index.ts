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

export async function decodeHashes(input: Uint8Array<ArrayBuffer>) {
	const decompressed = Bun.gunzipSync(input);
	const buffer = Buffer.from(decompressed);
	const hashes: RangedHash[] = [];

	for (let i = 0; i < buffer.length; i += 24) {
		const start = Number(buffer.readBigUInt64LE(i));
		const end = Number(buffer.readBigUInt64LE(i + 8));
		const hash = buffer.readBigUInt64LE(i + 16);
		hashes.push({ start, end, hash });
	}

	return hashes;
}

export function verifyHashes(a: RangedHash[], b: RangedHash[]): Range[] {
	const mismatches: Range[] = [];

	const mapA = new Map<string, bigint>();
	for (const { start, end, hash } of a) {
		mapA.set(`${start}:${end}`, hash);
	}

	for (const { start, end, hash } of b) {
		const key = `${start}:${end}`;
		const hashA = mapA.get(key);
		if (hashA === undefined || hashA !== hash) {
			mismatches.push({ start, end });
		}
	}

	return mismatches;
}
