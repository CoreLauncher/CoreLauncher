import { useState } from "react";
import "./GameList.css";
import useGames from "../../hooks/useGames";

export default function GameList() {
	const [query, setQuery] = useState("");
	const games = useGames();

	function onQuery(event: React.ChangeEvent<HTMLInputElement>) {
		setQuery(event.target.value);
	}

	return (
		<div className="GameList">
			<input type="text" placeholder="Search..." onChange={onQuery} />
			<div className="games">
				{games
					.sort((a, b) => a.name.localeCompare(b.name))
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
