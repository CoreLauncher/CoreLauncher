import useGames from "../../../hooks/useGames";
import GameCapsule from "../../Atoms/GameCapsule/GameCapsule";
import "./LibraryOverview.css";

export default function LibraryOverview({
	onSelect,
}: {
	onSelect?: (gameId: string) => void;
}) {
	const games = useGames();

	return (
		<div className="LibraryOverview">
			{games.map((game) => (
				<GameCapsule
					key={game.id}
					className="capsule"
					id={game.id}
					onClick={() => onSelect?.(game.id)}
				/>
			))}
		</div>
	);
}
