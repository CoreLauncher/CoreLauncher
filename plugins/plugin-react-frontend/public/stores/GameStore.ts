import { create } from "zustand";
import {
	type GamesUpdatedMessage,
	MessageType,
	type ProfilesUpdatedMessage,
} from "../../types/messages";
import Socket from "../classes/Socket";

type GameStoreState = {
	games: GamesUpdatedMessage["games"];
	profiles: ProfilesUpdatedMessage["profiles"];
	getGame: (id: string) => GamesUpdatedMessage["games"][0] | undefined;
	getProfile: (id: string) => ProfilesUpdatedMessage["profiles"][0] | undefined;
	getProfiles: (game: string) => ProfilesUpdatedMessage["profiles"];
};

export const useGameStore = create<GameStoreState>()((_set, get) => ({
	games: [],
	profiles: [],
	getGame: (id: string) => get().games.find((game) => game.id === id),
	getProfile: (id: string) =>
		get().profiles.find((profile) => profile.id === id),
	getProfiles: (game: string) => get().profiles.filter((p) => p.game === game),
}));

const socket = Socket.instance;

socket.on("message", (type, message) => {
	if (type !== MessageType.GamesUpdated) return;
	const data = message as GamesUpdatedMessage;
	useGameStore.setState({ games: data.games });
});

socket.on("message", (type, message) => {
	if (type !== MessageType.ProfilesUpdated) return;
	const data = message as ProfilesUpdatedMessage;
	useGameStore.setState({ profiles: data.profiles });
});
