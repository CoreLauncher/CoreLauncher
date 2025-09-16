import { describe, expect, it } from "bun:test";
import { decodeHashes, encodeHashes, generateHashes } from ".";

describe("hash-block", () => {
	it("hashes a file in blocks", async () => {
		const hashes = await generateHashes("./packages/hash-block/test.txt");

		expect(hashes.length).toBe(2);
		expect(hashes[0]).toEqual({
			start: 0,
			end: 8192,
			hash: BigInt("9166580184379656347"),
		});
		expect(hashes[1]).toEqual({
			start: 8192,
			end: 10560,
			hash: BigInt("7397733459097692142"),
		});
	});

	it("encodes and decodes hashes", async () => {
		const hashes = await generateHashes("./packages/hash-block/test.txt");
		const encoded = await encodeHashes(hashes);
		const decoded = await decodeHashes(encoded);

		expect(decoded).toEqual(hashes);
	});
});
