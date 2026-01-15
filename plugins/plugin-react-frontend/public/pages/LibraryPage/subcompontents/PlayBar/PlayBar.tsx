import { type Icon, PlayFill, Plus } from "react-bootstrap-icons";
import "./PlayBar.css";
import { GameType } from "@corelauncher/sdk";
import { MessageType } from "../../../../../types/messages";
import Socket from "../../../../classes/Socket";
import { useGameStore } from "../../../../stores/GameStore";

export default function PlayBar({
	meta = [],
	gameId,
}: {
	meta?: { icon: Icon; title: string; content: string }[];
	gameId: string;
}) {
	const game = useGameStore((state) => state.getGame(gameId));
	if (!game) throw new Error(`Game with ID ${gameId} not found`);

	function onPlay() {
		Socket.instance.send(MessageType.LaunchGame, {
			id: gameId,
		});
	}

	return (
		<div className="PlayBar">
			<button className="playbutton" type="button" onClick={onPlay}>
				{game.type === GameType.Normal && <PlayFill size={"90%"} />}
				{game.type === GameType.Instanced && <Plus size={"90%"} />}
			</button>
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
