import { type Icon, PlayFill } from "react-bootstrap-icons";
import "./PlayBar.css";
import { GameFeature } from "@corelauncher/sdk";
import { useGameStore } from "../../../../stores/GameStore";

export default function PlayBar({
	meta = [],
	gameId,
	onPlay,
}: {
	meta?: { icon: Icon; title: string; content: string }[];
	gameId: string;
	onPlay: () => void;
}) {
	const game = useGameStore((state) => state.getGame(gameId));
	if (!game) throw new Error(`Game with ID ${gameId} not found`);

	return (
		<div className="PlayBar">
			{game.features.includes(GameFeature.NormalLaunch) && (
				<button className="playbutton" type="button" onClick={onPlay}>
					<PlayFill size={"90%"} />
				</button>
			)}
			<div className="metadata">
				{meta.map((item) => (
					<div key={item.title} className="metadata-item">
						<item.icon />
						<div>
							<p className="title">{item.title}</p>
							<p className="content">{item.content}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
