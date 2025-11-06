import { Activity, ClockHistory } from "react-bootstrap-icons";

import PlayBar from "../PlayBar/PlayBar";
import "./GameView.css";
import { Block } from "@corelauncher/react";
import LogoPattern from "../../../../components/Atoms/LogoPattern/LogoPattern";
import useGame from "../../../../hooks/useGame";

export default function GameView({ gameId }: { gameId: string }) {
	const game = useGame(gameId);

	if (!game) {
		throw new Error(`Game with ID ${gameId} not found`);
	}

	return (
		<div className="GameView">
			<Block
				className="banner"
				style={{
					backgroundImage: game.banner ? `url(${game.banner})` : undefined,
				}}
			>
				{!game.banner && <LogoPattern />}
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
