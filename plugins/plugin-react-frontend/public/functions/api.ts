import type { Game } from "../types";

export async function fetchApplicationVersion() {
	const response = await fetch("/api/application/version");
	const data = await response.json();
	return data as {
		version: string;
	};
}

export async function fetchGames() {
	const response = await fetch("/api/games/list");
	const data = await response.json();
	return data as Game[];
}

export async function fetchLaunchGame(gameId: string) {
	const response = await fetch(`/api/games/launch/${gameId}`, {
		method: "POST",
	});

	const result = await response.json();
	return result as boolean | string;
}

export async function fetchAccountProviders() {
	const response = await fetch("/api/account-providers/list");
	const data = await response.json();
	return data as {
		id: string;
		name: string;
		color: string;
		logo: string;
	}[];
}

export async function fetchConnectAccountProvider(providerId: string) {
	const response = await fetch(`/api/account-providers/${providerId}/connect`, {
		method: "POST",
	});

	const result = await response.json();
	return result as boolean | string;
}
