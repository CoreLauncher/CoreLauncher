import { create } from "zustand";
import { type GamesUpdatedMessage, MessageType } from "../../types/messages";
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
