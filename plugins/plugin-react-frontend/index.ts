import { SizeConstraint, Window } from "@corebyte/webwindow";
import { isProduction } from "@corelauncher/is-production";
import { type PluginPortal, PluginShape } from "@corelauncher/types";
import open from "open";
import temporaryDirectory from "temp-dir";
import Server from "./classes/Server";
import {
	type LaunchGameMessage,
	MessageType,
	type OpenExternalLinkMessage,
	type StartAccountProviderConnectionMessage,
} from "./types/messages";
import { getVersion } from "./util/version" with { type: "macro" };

const icon = await import("../../icon.ico", {
	with: { type: "file" },
});
const tempIcon = `${temporaryDirectory}/corelauncher-tray-icon.ico`;
await Bun.write(tempIcon, Bun.file(icon.default));

export const id = "plugin-react-frontend";
export const format = 1;
export const name = "React frontend";
export const description =
	"A pretty frontend for CoreLauncher using React and a browserview.";

export class Plugin extends PluginShape {
	private server: Server;
	private window: Window;
	constructor(portal: PluginPortal) {
		super(portal);

		this.server = new Server();

		const windowOptions = {
			debug: !isProduction,
			title: "CoreLauncher",
			url: this.server.url,
			show: portal.arguments[0] !== "hidden",
			size: {
				width: 1200,
				height: 800,
				constraint: SizeConstraint.MIN,
			},
		} as ConstructorParameters<typeof Window>[0];

		this.window = new Window(windowOptions);
		this.window.on("close", () => {});

		this.server.send(
			MessageType.ApplicationInformation,
			{
				version: getVersion(),
				environment: isProduction ? "production" : "development",
			},
			true,
		);

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

		portal.on("games", () => {
			this.server.send(
				MessageType.GamesUpdated,
				{
					games: portal.getGames().map((game) => game.toJSON()),
				},
				true,
			);
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

		portal.on("account_instances", (accounts) => {
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
