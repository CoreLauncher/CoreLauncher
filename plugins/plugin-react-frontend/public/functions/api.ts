export async function fetchGames() {
	const response = await fetch("/api/games/list");
	const data = await response.json();
	return data as { id: string; name: string }[];
}
