import { Activity, ClockHistory } from "react-bootstrap-icons";

import PlayBar from "../PlayBar/PlayBar";
import "./GameView.css";
import { Block } from "@corelauncher/react";
import LogoPattern from "../../../../components/Atoms/LogoPattern/LogoPattern";
import { useGameStore } from "../../../../stores/GameStore";

export default function GameView({ gameId }: { gameId: string }) {
	const game = useGameStore((state) => state.getGame(gameId));
	if (!game) throw new Error(`Game with ID ${gameId} not found`);

	return (
		<div className="GameView">
			<Block
				className="banner"
				style={{
					backgroundImage: game.bannerUrl
						? `url(${game.bannerUrl})`
						: undefined,
				}}
			>
				{!game.bannerUrl && <LogoPattern />}
				<PlayBar
					game={game.id}
					meta={[
						{ icon: Activity, title: "Last played", content: "Never" },
						{ icon: ClockHistory, title: "Playtime", content: "Unknown" },
					]}
				/>
			</Block>
		</div>
	);
}
