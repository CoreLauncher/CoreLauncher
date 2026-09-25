import useGameInstances from "./use-game-instances";

export default function useGameInstance(instanceId: string) {
	const instances = useGameInstances();
	return instances.find((instance) => instance.id === instanceId);
}
