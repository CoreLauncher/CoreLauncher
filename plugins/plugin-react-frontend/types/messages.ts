import type {
	AccountInstanceShape,
	AccountProviderShape,
	GameShape,
	Option,
	ShowDialogOptions,
} from "@corelauncher/sdk";

export enum MessageType {
	GameOptionsRequest = "GameOptionsRequest",
	GameOptionsResponse = "GameOptionsResponse",
	WindowInteraction = "WindowInteraction",
	ApplicationInformation = "ApplicationInformation",
	GamesUpdated = "GamesUpdated",
	GameStateUpdated = "GameStateUpdated",
	AccountInstancesUpdated = "AccountInstancesUpdated",
	AccountProvidersUpdated = "AccountProvidersUpdated",
	StartAccountProviderConnection = "StartAccountProviderConnection",
	DeleteAccountProviderConnection = "DeleteAccountProviderConnection",
	LaunchGame = "LaunchGame",
	OpenExternalLink = "OpenExternalLink",
	ShowDialogRequest = "ShowDialogRequest",
	CloseDialogRequest = "CloseDialogRequest",
}

export type GameOptionsRequestMessage = {
	id: string;
	options: Record<string, string | number | boolean>;
};

export type GameOptionsResponseMessage = {
	id: string;
	options: Option[];
};

export type WindowInteractionMessage = {
	type: "drag" | "minimize" | "maximize" | "close" | "close_fully";
};

export interface ApplicationInformationMessage {
	version: string;
	environment: "development" | "production";
}

export interface GamesUpdatedMessage {
	games: ReturnType<GameShape["toJSON"]>[];
}

export interface GameStateUpdatedMessage {
	id: string;
	newState: string;
	oldState: string;
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

export type DeleteAccountProviderConnectionMessage = {
	provider: string;
	instance: string;
};

export type LaunchGameMessage = {
	id: string;
};

export type OpenExternalLinkMessage = {
	url: string;
};

export type ShowDialogRequestMessage = ShowDialogOptions;

export type CloseDialogRequestMessage = {
	id: string;
};

export type Message =
	| GameOptionsRequestMessage
	| GameOptionsResponseMessage
	| WindowInteractionMessage
	| ApplicationInformationMessage
	| GamesUpdatedMessage
	| GameStateUpdatedMessage
	| AccountInstancesUpdatedMessage
	| AccountProvidersUpdatedMessages
	| StartAccountProviderConnectionMessage
	| DeleteAccountProviderConnectionMessage
	| LaunchGameMessage
	| OpenExternalLinkMessage
	| ShowDialogRequestMessage
	| CloseDialogRequestMessage;

export type MessageTypeMap = {
	[MessageType.GameOptionsRequest]: GameOptionsRequestMessage;
	[MessageType.GameOptionsResponse]: GameOptionsResponseMessage;
	[MessageType.WindowInteraction]: WindowInteractionMessage;
	[MessageType.ApplicationInformation]: ApplicationInformationMessage;
	[MessageType.GamesUpdated]: GamesUpdatedMessage;
	[MessageType.GameStateUpdated]: GameStateUpdatedMessage;
	[MessageType.AccountInstancesUpdated]: AccountInstancesUpdatedMessage;
	[MessageType.AccountProvidersUpdated]: AccountProvidersUpdatedMessages;
	[MessageType.StartAccountProviderConnection]: StartAccountProviderConnectionMessage;
	[MessageType.DeleteAccountProviderConnection]: DeleteAccountProviderConnectionMessage;
	[MessageType.LaunchGame]: LaunchGameMessage;
	[MessageType.OpenExternalLink]: OpenExternalLinkMessage;
	[MessageType.ShowDialogRequest]: ShowDialogRequestMessage;
	[MessageType.CloseDialogRequest]: CloseDialogRequestMessage;
};
