import clsx from "clsx";
import useGame from "../../../hooks/useGame";
import "./GameCapsule.css";

export default function GameCapsule({
	className,
	id,
}: {
	className?: string;
	id: string;
}) {
	const game = useGame(id);
	if (!game) throw new Error(`Game with id ${id} not found`);

	return (
		<div className={clsx("GameCapsule", className)}>
			<p>{game.name}</p>
			{game.capsule && <img src={game.capsule} aria-label="game capsule" />}
		</div>
	);
}
