import type {
	AccountInstanceShape,
	AccountProviderShape,
	GameShape,
	ShowDialogOptions,
} from "@corelauncher/types";

export enum MessageType {
	WindowInteraction = "WindowInteraction",
	ApplicationInformation = "ApplicationInformation",
	GamesUpdated = "GamesUpdated",
	GameStateUpdated = "GameStateUpdated",
	AccountInstancesUpdated = "AccountInstancesUpdated",
	AccountProvidersUpdated = "AccountProvidersUpdated",
	StartAccountProviderConnection = "StartAccountProviderConnection",
	LaunchGame = "LaunchGame",
	OpenExternalLink = "OpenExternalLink",
	ShowDialogRequest = "ShowDialogRequest",
	CloseDialogRequest = "CloseDialogRequest",
}

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
	| WindowInteractionMessage
	| ApplicationInformationMessage
	| GamesUpdatedMessage
	| GameStateUpdatedMessage
	| AccountInstancesUpdatedMessage
	| AccountProvidersUpdatedMessages
	| StartAccountProviderConnectionMessage
	| LaunchGameMessage
	| OpenExternalLinkMessage
	| ShowDialogRequestMessage
	| CloseDialogRequestMessage;

export type MessageTypeMap = {
	[MessageType.WindowInteraction]: WindowInteractionMessage;
	[MessageType.ApplicationInformation]: ApplicationInformationMessage;
	[MessageType.GamesUpdated]: GamesUpdatedMessage;
	[MessageType.GameStateUpdated]: GameStateUpdatedMessage;
	[MessageType.AccountInstancesUpdated]: AccountInstancesUpdatedMessage;
	[MessageType.AccountProvidersUpdated]: AccountProvidersUpdatedMessages;
	[MessageType.StartAccountProviderConnection]: StartAccountProviderConnectionMessage;
	[MessageType.LaunchGame]: LaunchGameMessage;
	[MessageType.OpenExternalLink]: OpenExternalLinkMessage;
	[MessageType.ShowDialogRequest]: ShowDialogRequestMessage;
	[MessageType.CloseDialogRequest]: CloseDialogRequestMessage;
};
