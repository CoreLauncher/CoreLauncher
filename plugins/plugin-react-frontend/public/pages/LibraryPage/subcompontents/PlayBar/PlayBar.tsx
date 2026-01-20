import { type Icon, PlayFill, Plus } from "react-bootstrap-icons";
import "./PlayBar.css";
import { GameType } from "@corelauncher/sdk";
import { useState } from "react";
import {
	type GamesUpdatedMessage,
	MessageType,
} from "../../../../../types/messages";
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

	function onPlay(game: GamesUpdatedMessage["games"][0]) {
		switch (game.type) {
			case GameType.Normal:
				return Socket.instance.send(MessageType.LaunchGame, {
					id: gameId,
				});
			case GameType.Instanced: {
				setIsCreatingInstance(true);
				break;
			}
		}
	}

	return (
		<div className="PlayBar">
			<button className="playbutton" type="button" onClick={() => onPlay(game)}>
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
			{isCreatingInstance && (
				<CreateInstanceDialog
					gameId={gameId}
					onClose={() => setIsCreatingInstance(false)}
				/>
			)}
		</div>
	);
}
