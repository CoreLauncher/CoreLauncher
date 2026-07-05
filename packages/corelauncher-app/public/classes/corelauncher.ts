export default class CoreLauncher {
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

	constructor() {
		console.info("CoreLauncher initialized");
		window.addEventListener("corelauncher:plugin-event", console.log);
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
