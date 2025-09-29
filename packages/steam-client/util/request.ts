type Options = {
	interface: string;
	method: string;
	version?: number;
	httpMethod?: "GET" | "POST";
	data?: Record<string, string | number | undefined>;
};

export async function request(options: Options) {
	const parameters = new URLSearchParams();

	for (const key in options.data ?? {}) {
		const value = options.data![key];
		if (value === undefined) continue;
		parameters.append(key, value.toString());
	}

	const url = `https://api.steampowered.com/${options.interface}/${options.method}/v${options.version ?? 1}/?${parameters.toString()}`;
	const response = await fetch(url, {
		method: options.httpMethod ?? "GET",
	});

	const data = await response.json();
	return data.response;
}
