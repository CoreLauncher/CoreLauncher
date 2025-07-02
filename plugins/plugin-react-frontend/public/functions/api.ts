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

	if (!response.ok) throw new Error(`Failed to launch game with ID ${gameId}`);
	const result = await response.json();
	return result as boolean | string;
}
