import { use } from "react";
import { fetchGames } from "../functions/api";

const games = fetchGames();

export default function useGames() {
	return use(games);
}
