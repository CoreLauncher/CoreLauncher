import { TypedEmitter } from "typed-emitter";
import type { AccountProvider } from "../types/account-provider";
import type { PluginEvent } from "../types/event";

interface CoreLauncherEvents {
	account_providers_updated: (providers: AccountProvider[]) => void;
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
				default: {
					console.warn("Unknown plugin event type", payload);
				}
			}
		});
		this.sendMessage("webview_initialized");
	}

	// biome-ignore lint/suspicious/noExplicitAny: temporary?
	sendMessage(type: string, payload?: any) {
		window.ipc.postMessage(
			JSON.stringify({
				type,
				payload,
			}),
		);
	}
}
