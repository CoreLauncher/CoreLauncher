import { useEffect, useState } from "react";
import "./GameList.css";
import { fetchGames } from "../../functions/api";

type Game = {
	id: string;
	name: string;
};

export default function GameList() {
	const [games, setGames] = useState<Game[]>([]);

	useEffect(() => {
		fetchGames().then((data) => {
			setGames(data);
		});
	}, []);

	return (
		<div className="GameList">
			{games.map((game) => (
				<div className="game" key={game.id}>
					<p>{game.name}</p>
				</div>
			))}
		</div>
	);
}
