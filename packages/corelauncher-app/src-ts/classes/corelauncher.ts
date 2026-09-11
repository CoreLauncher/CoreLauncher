import { TypedEmitter } from "typed-emitter";
import type { AccountInstance, AccountProvider } from "../types/accounts";
import type { PluginEvent } from "../types/event";

interface CoreLauncherEvents {
	account_providers_updated: (providers: AccountProvider[]) => void;
	account_instances_updated: (instances: AccountInstance[]) => void;
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
