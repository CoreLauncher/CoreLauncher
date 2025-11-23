import { create } from "zustand";
import {
	type AccountInstancesUpdatedMessage,
	type AccountProvidersUpdatedMessages,
	MessageType,
} from "../../types/messages";
import Socket from "../classes/Socket";

type AccountStoreState = {
	accounts: AccountInstancesUpdatedMessage["accounts"];
	providers: AccountProvidersUpdatedMessages["providers"];
};

export const useAccountStore = create<AccountStoreState>()(() => ({
	accounts: [],
	providers: [],
}));

const socket = Socket.instance;

socket.on("message", (type, message) => {
	if (type !== MessageType.AccountInstancesUpdated) return;
	const data = message as AccountInstancesUpdatedMessage;
	useAccountStore.setState({ accounts: data.accounts });
});

socket.on("message", (type, message) => {
	if (type !== MessageType.AccountProvidersUpdated) return;
	const data = message as AccountProvidersUpdatedMessages;
	useAccountStore.setState({ providers: data.providers });
});
