import { dlopen, FFIType, JSCallback, ptr } from "bun:ffi";
import dll from "./tray.dll" with { type: "file" };
import { TypedEmitter } from "tiny-typed-emitter";
import { existsSync } from "node:fs";

const lib = dlopen(dll, {
	tray_create: {
		args: [FFIType.cstring, FFIType.cstring],
		return: FFIType.void,
	},
	tray_destroy: {
		args: [],
		return: FFIType.void,
	},
	tray_register_click_callback: {
		args: [FFIType.function],
		returns: FFIType.void,
	},
});

function encodeCString(value: string) {
	return ptr(new TextEncoder().encode(`${value}\0`));
}

interface TrayEvents {
	click: () => void;
}

export class Tray extends TypedEmitter<TrayEvents> {
	public created = false;

	create(name: string, icon: string) {
		if (this.created) throw new Error("Tray already created");
		if (!existsSync(icon)) throw new Error(`Icon file does not exist: ${icon}`);

		const encodedName = encodeCString(name);
		const encodedIcon = encodeCString(icon);

		const onClick = new JSCallback(
			() => {
				console.log("Tray icon clicked!");
				this.emit("click");
			},
			{
				args: [],
				returns: FFIType.void,
			},
		);

		if (!onClick.ptr) throw new Error("Callback pointer is null");
		lib.symbols.tray_register_click_callback(onClick.ptr);
		lib.symbols.tray_create(encodedIcon, encodedName);
		this.created = true;
	}

	destroy() {
		if (!this.created) throw new Error("Tray not created yet");
		lib.symbols.tray_destroy();
		this.created = false;
	}
}
