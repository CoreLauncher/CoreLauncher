import { join } from "node:path";
import { isProduction } from "@corelauncher/is-production";
import { Rod, type Tray, type WebView } from "@corelauncher/rod";
import { type PluginPortal, PluginShape } from "@corelauncher/sdk";
import open from "open";
import temporaryDirectory from "temp-dir";
import Server from "./classes/Server";
import {
	type DeleteAccountProviderConnectionMessage,
	type GameProfileCreateMessage,
	type GameProfileCreateOptionsRequestMessage,
	type LaunchGameMessage,
	type LaunchProfileMessage,
	MessageType,
	type OpenExternalLinkMessage,
	type StartAccountProviderConnectionMessage,
	type WindowInteractionMessage,
} from "./types/messages";
import { getVersion } from "./util/version" with { type: "macro" };

const icon = await import("../../icon.ico", {
	with: { type: "file" },
});
const tempIcon = `${temporaryDirectory}/corelauncher-tray-icon.ico`;
await Bun.write(tempIcon, Bun.file(icon.default));

export const id = "plugin-react-frontend";
export const format = 1;
export const name = "React Frontend";
export const description =
	"A pretty frontend for CoreLauncher using React and a webview.";

export class Plugin extends PluginShape {
	gameProviders: never[] = [];
	gameInstances: never[] = [];
	gameProfiles: never[] = [];
	accountProviders: never[] = [];
	accountInstances: never[] = [];

	private server: Server;
	private rod: Rod;
	private window: WebView;
	private tray: Tray;
	constructor(portal: PluginPortal) {
		super(portal);

		this.server = new Server();
		this.rod = new Rod();

		this.window = this.rod.createWebView({
			title: "CoreLauncher",
			url: this.server.url,
			visible: portal.arguments[0] !== "hidden",
			devTools: true, //!isProduction,
			focused: !isProduction,
			decorations: false,
			minimumSize: { width: 1200, height: 800 },
			dataDirectory: join(portal.getDataDirectory(), "rod_data"),
		});

		this.window.on("close_requested", () => {
			this.window.setVisible(false);
		});

		this.tray = this.rod.createTray({
			iconPath: tempIcon,
			tooltip: "CoreLauncher",
			title: "CoreLauncher",
		});

		this.tray.on("click", () => {
			if (this.window.isVisible) return;
			this.window.setVisible(true);
		});

		portal.on("app_instance", () => {
			if (this.window.isVisible) return;
			this.window.setVisible(true);
		});

		portal.on("show_dialog_request", (options) => {
			this.server.send(MessageType.ShowDialogRequest, options, false);
		});

		portal.on("close_dialog_request", (options) => {
			this.server.send(MessageType.CloseDialogRequest, options, false);
		});

		portal.on("game_instances_updated", () => {
			this.server.send(
				MessageType.GamesUpdated,
				{
					games: portal.getGameInstances().map((game) => game.toJSON()),
				},
				true,
			);
		});

		portal.on("game_profiles_updated", () => {
			this.server.send(
				MessageType.ProfilesUpdated,
				{
					profiles: portal.getGameProfiles().map((profile) => profile.toJSON()),
				},
				true,
			);
		});

		portal.on("account_providers_updated", () => {
			this.server.send(
				MessageType.AccountProvidersUpdated,
				{
					providers: portal
						.getAccountProviders()
						.map((provider) => provider.toJSON()),
				},
				true,
			);
		});

		portal.on("account_instances_updated", () => {
			this.server.send(
				MessageType.AccountInstancesUpdated,
				{
					// Change this later
					accounts: portal
						.getAccountInstances()
						.map((account) => account.toJSON()),
				},
				true,
			);
		});

		this.server.send(
			MessageType.ApplicationInformation,
			{
				version: getVersion(),
				environment: isProduction ? "production" : "development",
			},
			true,
		);

		this.server.on("message", async (type, message) => {
			switch (type) {
				case MessageType.GameProfileCreateOptionsRequest: {
					const data = message as GameProfileCreateOptionsRequestMessage;
					const game = portal.getGameInstance(data.id);
					const options = await game.createProfileOptions(data.options);

					this.server.send(MessageType.GameProfileCreateOptionsResponse, {
						id: data.id,
						options: options,
					});

					break;
				}
				case MessageType.GameProfileCreate: {
					const data = message as GameProfileCreateMessage;
					const game = portal.getGameInstance(data.id);

					game.createProfile(data.name, data.options);
					break;
				}
				case MessageType.WindowInteraction: {
					const data = message as WindowInteractionMessage;
					if (data.type === "drag") this.window.startDrag();
					if (data.type === "minimize") return this.window.setMinimized(true);
					if (data.type === "maximize")
						return this.window.setMaximized(!this.window.isMaximized);
					if (data.type === "close") return this.window.setVisible(false);
					if (data.type === "close_fully") return portal.exit();
					break;
				}
				case MessageType.OpenExternalLink: {
					const data = message as OpenExternalLinkMessage;
					return open(data.url);
				}
				case MessageType.LaunchGame: {
					const data = message as LaunchGameMessage;
					const game = portal.getGameInstance(data.id);
					return game.launch();
				}
				case MessageType.LaunchProfile: {
					const data = message as LaunchProfileMessage;
					const profile = portal.getGameProfile(data.id);
					return profile.launch();
				}
				case MessageType.StartAccountProviderConnection: {
					const data = message as StartAccountProviderConnectionMessage;
					const provider = portal.getAccountProvider(data.id);
					return provider.connect();
				}
				case MessageType.DeleteAccountProviderConnection: {
					const data = message as DeleteAccountProviderConnectionMessage;
					const instance = portal.getAccountInstance(data.instance);
					return instance.disconnect();
				}
			}
		});

		setImmediate(() => this.emit("ready"));
	}
}
