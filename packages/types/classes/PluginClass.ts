import { TypedEmitter } from "@corelauncher/typed-emitter";

export class PluginClass extends TypedEmitter {
	constructor() {
		super();

		this.once("ready", () => {
			if (this.listeners("ready").length === 1) return;
			setImmediate(() => {
				this.emit("ready");
			});
		});
	}
}
