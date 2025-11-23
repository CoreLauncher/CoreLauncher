import { useGameStore } from "../../../stores/GameStore";
import GameCapsule from "../../Atoms/GameCapsule/GameCapsule";
import "./LibraryOverview.css";

export default function LibraryOverview({
	onSelect,
}: {
	onSelect?: (gameId: string) => void;
}) {
	const games = useGameStore((state) => state.games);

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
