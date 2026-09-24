import SymbolPattern from "../../../../components/branding/symbol-pattern/symbol-pattern";
import Block from "../../../../components/layout/block/block";
import useGameInstance from "../../../../hooks/use-game-instance";
import "./game-overview.css";

export default function GameOverview({ instanceId }: { instanceId: string }) {
	const instance = useGameInstance(instanceId)!;

	return (
		<div className="GameOverview">
			<Block className="banner">
				{instance.banner && (
					<div
						className="background"
						style={{
							["--banner-image" as string]: `url(${instance.banner})`,
						}}
					>
						<div className="background-blur" />
						<div className="background-image" />
					</div>
				)}
				{!instance.banner && <SymbolPattern />}
			</Block>
		</div>
	);
}
