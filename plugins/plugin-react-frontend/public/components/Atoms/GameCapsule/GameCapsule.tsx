import clsx from "clsx";
import "./GameCapsule.css";
import { useGameStore } from "../../../stores/GameStore";

export default function GameCapsule({
	id,
	onClick,
	className,
}: {
	id: string;
	onClick?: () => void;
	className?: string;
}) {
	const game = useGameStore((state) => state.getGame(id));
	if (!game) throw new Error(`Game with id ${id} not found`);

	return (
		<button
			className={clsx("GameCapsule", className)}
			type="button"
			onClick={onClick}
			style={{
				cursor: onClick ? "pointer" : "default",
			}}
		>
			<p>{game.name}</p>
			{game.capsuleUrl && (
				<img src={game.capsuleUrl} aria-label="game capsule" />
			)}
		</button>
	);
}
