import { create } from "zustand";
import {
	type ApplicationInformationMessage,
	MessageType,
} from "../../types/messages";
import Socket from "../classes/Socket";

type ApplicationStoreState = {
	version: string;
	environment: "development" | "production";
};

export const useApplicationStore = create<ApplicationStoreState>()(() => ({
	version: "Unknown",
	environment: "development",
}));

const socket = Socket.instance;

socket.on("message", (type, message) => {
	if (type !== MessageType.ApplicationInformation) return;
	const data = message as ApplicationInformationMessage;
	useApplicationStore.setState({
		version: data.version,
		environment: data.environment,
	});
});
