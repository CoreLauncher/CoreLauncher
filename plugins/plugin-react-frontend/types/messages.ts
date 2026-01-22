import type {
	AccountInstanceShape,
	AccountProviderShape,
	GameInstanceShape,
	Option,
	ShowDialogOptions,
} from "@corelauncher/sdk";

export enum MessageType {
	GameProfileCreateOptionsRequest = "GameProfileCreateOptionsRequest",
	GameProfileCreateOptionsResponse = "GameProfileCreateOptionsResponse",
	GameProfileCreate = "GameProfileCreate",
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

export type GameProfileCreateOptionsRequestMessage = {
	id: string;
	options: Record<string, string | number | boolean>;
};

export type GameProfileCreateOptionsResponseMessage = {
	id: string;
	options: Option[];
};

export type GameProfileCreateMessage = {
	id: string;
	name: string;
	options: Record<string, string | number | boolean>;
};

export type WindowInteractionMessage = {
	type: "drag" | "minimize" | "maximize" | "close" | "close_fully";
};

export interface ApplicationInformationMessage {
	version: string;
	environment: "development" | "production";
}

export interface GamesUpdatedMessage {
	games: ReturnType<GameInstanceShape["toJSON"]>[];
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
	| GameProfileCreateOptionsRequestMessage
	| GameProfileCreateOptionsResponseMessage
	| GameProfileCreateMessage
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
	[MessageType.GameProfileCreateOptionsRequest]: GameProfileCreateOptionsRequestMessage;
	[MessageType.GameProfileCreateOptionsResponse]: GameProfileCreateOptionsResponseMessage;
	[MessageType.GameProfileCreate]: GameProfileCreateMessage;
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
