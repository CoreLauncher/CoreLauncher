import { useEffect, useState } from "react";
import "./GameList.css";
import { fetchGames } from "../../functions/api";

type Game = {
	id: string;
	name: string;
};

export default function GameList() {
	const [games, setGames] = useState<Game[]>([]);
	const [query, setQuery] = useState("");

	useEffect(() => {
		fetchGames().then((data) => {
			setGames(data);
		});
	}, []);

	function onQuery(event: React.ChangeEvent<HTMLInputElement>) {
		setQuery(event.target.value);
	}

	return (
		<div className="GameList">
			<input type="text" placeholder="Search..." onChange={onQuery} />
			<div className="games">
				{games
					.filter(
						(game) =>
							game.name.toLowerCase().includes(query.toLowerCase()) ||
							game.id.toLowerCase().includes(query.toLowerCase()),
					)
					.map((game) => (
						<div className="game" key={game.id}>
							<p>{game.name}</p>
						</div>
					))}
			</div>
		</div>
	);
}
