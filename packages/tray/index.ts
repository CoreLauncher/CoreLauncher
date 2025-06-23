import { dlopen, FFIType } from "bun:ffi";
import dll from "./tray.dll" with { type: "file" };

const lib = dlopen(dll, {
	tray_create: {
		args: [],
		return: FFIType.void,
	},
	tray_destroy: {
		args: [],
		return: FFIType.void,
	},
});

export class Tray {
	public created = false;

	create() {
		if (this.created) throw new Error("Tray already created!");
		lib.symbols.tray_create();
		this.created = true;
	}

	destroy() {
		if (!this.created) throw new Error("Tray not created yet");
		lib.symbols.tray_destroy();
		this.created = false;
	}
}
