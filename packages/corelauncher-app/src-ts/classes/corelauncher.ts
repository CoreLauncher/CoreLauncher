import { TypedEmitter } from "typed-emitter";
import type { AccountInstance, AccountProvider } from "../types/accounts";
import type { PluginEvent } from "../types/event";
import type { GameInstance, GameProfile, GameProvider } from "../types/games";

interface CoreLauncherEvents {
	account_providers_updated: (providers: AccountProvider[]) => void;
	account_instances_updated: (instances: AccountInstance[]) => void;

	game_providers_updated: (providers: GameProvider[]) => void;
	game_instances_updated: (providers: GameInstance[]) => void;
	game_profiles_updated: (providers: GameProfile[]) => void;
}

export default class CoreLauncher extends TypedEmitter<CoreLauncherEvents> {
	private static _instance: CoreLauncher;

	static get instance() {
		if (!CoreLauncher._instance) {
			const instance = new CoreLauncher();
			//@ts-expect-error
			window.corelauncher = instance;
			CoreLauncher._instance = instance;
		}
		return CoreLauncher._instance;
	}

	accountProviders: AccountProvider[] = [];
	accountInstances: AccountInstance[] = [];

	gameProviders: GameProvider[] = [];
	gameInstances: GameInstance[] = [];
	gameProfiles: GameProfile[] = [];

	constructor() {
		super();
		console.info("CoreLauncher initialized");
		window.addEventListener("corelauncher:plugin-event", (event) => {
			const payload = (event as CustomEvent<PluginEvent>).detail;
			switch (payload.type) {
				case "account_providers_updated": {
					console.info("Account providers updated", payload.payload);
					this.accountProviders = payload.payload;
					this.emit("account_providers_updated", payload.payload);
					break;
				}
				case "account_instances_updated": {
					console.info("Account instances updated", payload.payload);
					this.accountInstances = payload.payload;
					this.emit("account_instances_updated", payload.payload);
					break;
				}
				case "game_providers_updated": {
					console.info("Game providers updated", payload.payload);
					this.gameProviders = payload.payload;
					this.emit("game_providers_updated", payload.payload);
					break;
				}
				case "game_instances_updated": {
					console.info("Game instances updated", payload.payload);
					this.gameInstances = payload.payload;
					this.emit("game_instances_updated", payload.payload);
					break;
				}
				case "game_profiles_updated": {
					console.info("Game profiles updated", payload.payload);
					this.gameProfiles = payload.payload;
					this.emit("game_profiles_updated", payload.payload);
					break;
				}
				default: {
					console.warn("Unknown plugin event type", payload);
				}
			}
		});
		this.sendMessage("webview_initialized");
	}

	// biome-ignore lint/suspicious/noExplicitAny: temporary?
	private sendMessage(type: string, payload?: any) {
		window.ipc.postMessage(
			JSON.stringify({
				type,
				payload,
			}),
		);
	}

	startWindowDrag() {
		this.sendMessage("window_drag");
	}

	startWindowResize(
		position:
			| "top"
			| "bottom"
			| "left"
			| "right"
			| "top-left"
			| "top-right"
			| "bottom-left"
			| "bottom-right",
	) {
		this.sendMessage("window_resize", { position });
	}

	connectAccountInstance(provider: AccountProvider) {
		this.sendMessage("account_connect", {
			pluginId: provider.pluginId,
			providerId: provider.id,
		});
	}

	disconnectAccountInstance(instance: AccountInstance) {
		this.sendMessage("account_disconnect", {
			pluginId: instance.pluginId,
			providerId: instance.providerId,
			instanceId: instance.id,
		});
	}
}
