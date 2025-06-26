import useGames from "./useGames";

export default function useGame(id: string) {
	const games = useGames();
	return games.find((game) => game.id === id);
}
