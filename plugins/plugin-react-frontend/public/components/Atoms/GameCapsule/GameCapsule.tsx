import clsx from "clsx";
import useGame from "../../../hooks/useGame";
import "./GameCapsule.css";

export default function GameCapsule({
	id,
	onClick,
	className,
}: {
	id: string;
	onClick?: () => void;
	className?: string;
}) {
	const game = useGame(id);
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
			{game.capsule && <img src={game.capsule} aria-label="game capsule" />}
		</button>
	);
}
