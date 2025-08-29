import { Activity, ClockHistory } from "react-bootstrap-icons";

import PlayBar from "../PlayBar/PlayBar";
import "./GameView.css";
import { Block } from "@corelauncher/react";
import useGame from "../../../../../hooks/useGame";
import LogoPattern from "../../../../Atoms/LogoPattern/LogoPattern";

export default function GameView({ gameId }: { gameId: string }) {
	const game = useGame(gameId);

	if (!game) {
		throw new Error(`Game with ID ${gameId} not found`);
	}

	return (
		<div className="GameView">
			<Block className="banner">
				<LogoPattern />
				<PlayBar
					game={game}
					meta={[
						{ icon: Activity, title: "Last played", content: "Never" },
						{ icon: ClockHistory, title: "Playtime", content: "Unknown" },
					]}
				/>
			</Block>
		</div>
	);
}
