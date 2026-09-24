import "./library-page.css";

import clsx from "clsx";
import { useState } from "react";
import Block from "../../components/layout/block/block";
import useGameInstances from "../../hooks/use-game-instances";
import GameOverview from "./sections/game-overview/game-overview";

export default function LibraryPage() {
	const gameInstances = useGameInstances();
	const [selectedGame, setSelectedGame] = useState<string | null>(null);

	return (
		<div className="LibraryPage">
			<Block className="library">
				<button
					className="overview-button"
					type="button"
					onClick={() => setSelectedGame(null)}
				>
					Overview
				</button>
				<div className="game-list">
					{gameInstances.map((instance) => (
						<button
							className={clsx("game-instance", {
								selected: selectedGame === instance.id,
							})}
							key={instance.id}
							type="button"
							onClick={() => setSelectedGame(instance.id)}
						>
							{instance.icon && <img src={instance.icon} aria-hidden />}
							<p>{instance.name}</p>
						</button>
					))}
				</div>
			</Block>
			{!selectedGame && (
				<div className="library-overview">
					{gameInstances.map((instance) => (
						<button
							className={clsx("game-capsule", {
								selected: selectedGame === instance.id,
							})}
							key={instance.id}
							type="button"
							onClick={() => setSelectedGame(instance.id)}
						>
							<p>{instance.name}</p>
							{instance.capsule && (
								<img
									src={instance.capsule}
									className="capsule-image"
									aria-hidden
								/>
							)}
						</button>
					))}
				</div>
			)}
			{selectedGame && <GameOverview instanceId={selectedGame} />}
		</div>
	);
}
