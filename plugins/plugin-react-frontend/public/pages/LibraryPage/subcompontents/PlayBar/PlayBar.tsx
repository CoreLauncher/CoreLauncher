import { type Icon, PlayFill } from "react-bootstrap-icons";
import "./PlayBar.css";
import { GameFeature } from "@corelauncher/sdk";
import { useState } from "react";
import { MessageType } from "../../../../../types/messages";
import Socket from "../../../../classes/Socket";
import CreateInstanceDialog from "../../../../dialogs/CreateInstanceDialog/CreateInstanceDialog";
import { useGameStore } from "../../../../stores/GameStore";

export default function PlayBar({
	meta = [],
	gameId,
}: {
	meta?: { icon: Icon; title: string; content: string }[];
	gameId: string;
}) {
	const [isCreatingInstance, setIsCreatingInstance] = useState(false);
	const game = useGameStore((state) => state.getGame(gameId));
	if (!game) throw new Error(`Game with ID ${gameId} not found`);

	function onPlay() {
		return Socket.instance.send(MessageType.LaunchGame, {
			id: gameId,
		});
	}

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
			{isCreatingInstance && (
				<CreateInstanceDialog
					gameId={gameId}
					onClose={() => setIsCreatingInstance(false)}
				/>
			)}
		</div>
	);
}
