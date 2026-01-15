import { join } from "node:path";
import { isProduction } from "@corelauncher/is-production";
import { Rod, type Tray, type WebView } from "@corelauncher/rod";
import { type PluginPortal, PluginShape } from "@corelauncher/sdk";
import open from "open";
import temporaryDirectory from "temp-dir";
import Server from "./classes/Server";
import {
	type DeleteAccountProviderConnectionMessage,
	type LaunchGameMessage,
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
	"A pretty frontend for CoreLauncher using React and a browserview.";

export class Plugin extends PluginShape {
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

		this.server.send(
			MessageType.ApplicationInformation,
			{
				version: getVersion(),
				environment: isProduction ? "production" : "development",
			},
			true,
		);

		this.server.on("message", (type, message) => {
			if (type !== MessageType.WindowInteraction) return;
			const data = message as WindowInteractionMessage;
			if (data.type === "drag") this.window.startDrag();
			if (data.type === "minimize") return this.window.setMinimized(true);
			if (data.type === "maximize")
				return this.window.setMaximized(!this.window.isMaximized);
			if (data.type === "close") return this.window.setVisible(false);
			if (data.type === "close_fully") return portal.exit();
		});

		this.server.on("message", (type, message) => {
			if (type !== MessageType.OpenExternalLink) return;
			const data = message as OpenExternalLinkMessage;
			open(data.url);
		});

		this.server.on("message", (type, message) => {
			if (type !== MessageType.LaunchGame) return;
			const data = message as LaunchGameMessage;
			const game = portal.getGame(data.id);
			game.launch();
		});

		this.server.on("message", (type, message) => {
			if (type !== MessageType.StartAccountProviderConnection) return;
			const data = message as StartAccountProviderConnectionMessage;
			const provider = portal.getAccountProvider(data.id);
			provider.connect();
		});

		this.server.on("message", (type, message) => {
			if (type !== MessageType.DeleteAccountProviderConnection) return;
			const data = message as DeleteAccountProviderConnectionMessage;
			const instance = portal.getAccountInstance(data.instance);
			instance.disconnect();
		});

		portal.on("games", () => {
			this.server.send(
				MessageType.GamesUpdated,
				{
					games: portal.getGames().map((game) => game.toJSON()),
				},
				true,
			);
		});

		portal.on("game_state_changed", (game, newState, oldState) => {
			this.server.send(MessageType.GameStateUpdated, {
				id: game.id,
				newState,
				oldState,
			});
		});

		portal.on("account_providers", () => {
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

		portal.on("account_instances", () => {
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

		setImmediate(() => this.emit("ready"));
	}
}
