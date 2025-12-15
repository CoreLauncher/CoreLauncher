import { create } from "zustand";
import {
	type GameStateUpdatedMessage,
	type GamesUpdatedMessage,
	MessageType,
} from "../../types/messages";
import Socket from "../classes/Socket";

type GameStoreState = {
	games: GamesUpdatedMessage["games"];
	getGame: (id: string) => GamesUpdatedMessage["games"][0] | undefined;
};

export const useGameStore = create<GameStoreState>()((_set, get) => ({
	games: [],
	getGame: (id: string) => get().games.find((game) => game.id === id),
}));

const socket = Socket.instance;

socket.on("message", (type, message) => {
	if (type !== MessageType.GamesUpdated) return;
	const data = message as GamesUpdatedMessage;
	useGameStore.setState({ games: data.games });
});

socket.on("message", (type, message) => {
	if (type !== MessageType.GameStateUpdated) return;
	const data = message as GameStateUpdatedMessage;
	useGameStore.setState((state) => ({
		games: state.games.map((game) =>
			game.id === data.id
				? { ...game, state: data.newState as typeof game.state }
				: game,
		),
	}));
});
