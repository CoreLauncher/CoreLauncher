import { useEffect, useState } from "react";
import type { GameInstance } from "../types/games";
import useCoreLauncher from "./use-corelauncher";

export default function useGameInstances() {
	const corelauncher = useCoreLauncher();
	const [gameInstances, setGameInstances] = useState(
		corelauncher.gameInstances,
	);

	useEffect(() => {
		setGameInstances(corelauncher.gameInstances);
	}, []);

	useEffect(() => {
		function onChange(instances: GameInstance[]) {
			setGameInstances(instances);
		}

		corelauncher.on("game_instances_updated", onChange);
		return () => {
			corelauncher.off("game_instances_updated", onChange);
		};
	}, [corelauncher]);

	return gameInstances;
}
