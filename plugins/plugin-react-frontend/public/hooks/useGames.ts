import { useEffect, useState } from "react";
import Events from "../classes/Events";
import type { Game } from "../types";

export default function useGames() {
	const events = Events.getInstance();
	const [games, setGames] = useState<Game[]>(
		events.getValue<Game[]>("games") ?? [],
	);

	useEffect(() => {
		function onChange(newGames: Game[]) {
			setGames(newGames);
		}

		events.on("games", onChange);
		return () => {
			events.off("games", onChange);
		};
	}, [events]);

	return games;
}
