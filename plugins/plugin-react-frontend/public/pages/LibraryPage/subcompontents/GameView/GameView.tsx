import { Activity, ClockHistory } from "react-bootstrap-icons";
import Banner from "../Banner/Banner";
import PlayBar from "../PlayBar/PlayBar";
import "./GameView.css";
import useGame from "../../../../hooks/useGame";

export default function GameView({ gameId }: { gameId: string }) {
	const game = useGame(gameId);

	if (!game) {
		throw new Error(`Game with ID ${gameId} not found`);
	}

	return (
		<div className="GameView">
			<Banner>
				<div className="banner-content">
					<PlayBar
						game={game}
						meta={[
							{ icon: Activity, title: "Last played", content: "Never" },
							{ icon: ClockHistory, title: "Playtime", content: "Unknown" },
						]}
					/>
				</div>
			</Banner>
		</div>
	);
}
