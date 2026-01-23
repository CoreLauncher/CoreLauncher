import { Activity, ClockHistory, PlayFill, Plus } from "react-bootstrap-icons";

import PlayBar from "../PlayBar/PlayBar";
import "./GameView.css";
import { Block, Button, Text, TextMuted } from "@corelauncher/react";
import { GameFeature } from "@corelauncher/sdk";
import { useState } from "react";
import { MessageType } from "../../../../../types/messages";
import Socket from "../../../../classes/Socket";
import LogoPattern from "../../../../components/Atoms/LogoPattern/LogoPattern";
import CreateProfileDialog from "../../../../dialogs/CreateProfileDialog/CreateProfileDialog";
import { useGameStore } from "../../../../stores/GameStore";

export default function GameView({ gameId }: { gameId: string }) {
	const [isCreatingInstance, setIsCreatingInstance] = useState(false);

	const game = useGameStore((state) => state.getGame(gameId));
	if (!game) throw new Error(`Game with ID ${gameId} not found`);

	const profiles = useGameStore((state) => state.profiles);

	function onPlay() {
		return Socket.instance.send(MessageType.LaunchGame, {
			id: gameId,
		});
	}

	function onLaunchProfile(profileId: string) {
		return Socket.instance.send(MessageType.LaunchProfile, {
			id: profileId,
		});
	}

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
					gameId={game.id}
					meta={[
						{ icon: Activity, title: "Last played", content: "Never" },
						{ icon: ClockHistory, title: "Playtime", content: "Unknown" },
					]}
					onPlay={onPlay}
				/>
			</Block>
			<div className="features">
				{game.features.includes(GameFeature.Profiles) && (
					<div className="profiles">
						<div className="profiles-actions">
							<Button onClick={() => setIsCreatingInstance(true)}>
								<Plus size={16} /> Create new profile
							</Button>
						</div>
						<div className="profiles-list">
							{profiles
								.filter((profile) => profile.game === game.id)
								.map((profile) => (
									<Block key={profile.id} className="profile">
										<div className="profile-name">
											<Text>{profile.name}</Text>
											<TextMuted>{profile.subname}</TextMuted>
										</div>
										<Button
											style="success"
											onClick={() => onLaunchProfile(profile.id)}
										>
											<PlayFill /> Play
										</Button>
									</Block>
								))}
						</div>
					</div>
				)}
			</div>
			{isCreatingInstance && (
				<CreateProfileDialog
					gameId={gameId}
					onClose={() => setIsCreatingInstance(false)}
				/>
			)}
		</div>
	);
}
