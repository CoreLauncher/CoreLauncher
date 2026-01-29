export async function hashFile(file: string, algorithm: "sha1" = "sha1") {
	const stream = Bun.file(file).stream();
	const reader = stream.getReader();

	const hasher = new Bun.CryptoHasher(algorithm);

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		hasher.update(value);
	}

	return hasher.digest("hex");
}
