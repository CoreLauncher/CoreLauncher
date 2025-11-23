import type {
	AccountInstanceShape,
	AccountProviderShape,
	GameShape,
} from "@corelauncher/types";

export enum MessageType {
	ApplicationInformation = "ApplicationInformation",
	GamesUpdated = "GamesUpdated",
	AccountInstancesUpdated = "AccountInstancesUpdated",
	AccountProvidersUpdated = "AccountProvidersUpdated",
	StartAccountProviderConnection = "StartAccountProviderConnection",
	LaunchGame = "LaunchGame",
}

export interface ApplicationInformationMessage {
	version: string;
	environment: "development" | "production";
}

export interface GamesUpdatedMessage {
	games: ReturnType<GameShape["toJSON"]>[];
}

export type AccountInstancesUpdatedMessage = {
	accounts: ReturnType<AccountInstanceShape["toJSON"]>[];
};

export type AccountProvidersUpdatedMessages = {
	providers: ReturnType<AccountProviderShape["toJSON"]>[];
};

export type StartAccountProviderConnectionMessage = {
	id: string;
};

export type LaunchGameMessage = {
	id: string;
};

export type Message =
	| ApplicationInformationMessage
	| GamesUpdatedMessage
	| AccountInstancesUpdatedMessage
	| AccountProvidersUpdatedMessages
	| StartAccountProviderConnectionMessage
	| LaunchGameMessage;

export type MessageTypeMap = {
	[MessageType.ApplicationInformation]: ApplicationInformationMessage;
	[MessageType.GamesUpdated]: GamesUpdatedMessage;
	[MessageType.AccountInstancesUpdated]: AccountInstancesUpdatedMessage;
	[MessageType.AccountProvidersUpdated]: AccountProvidersUpdatedMessages;
	[MessageType.StartAccountProviderConnection]: StartAccountProviderConnectionMessage;
	[MessageType.LaunchGame]: LaunchGameMessage;
};
