import { dlopen, FFIType, JSCallback, ptr } from "bun:ffi";
import { EventEmitter } from "node:events";
import { existsSync } from "node:fs";
import dll from "./tray.dll" with { type: "file" };

function encodeCString(value: string) {
	return ptr(new TextEncoder().encode(`${value}\0`));
}

const lib = dlopen(dll, {
	tray_create: {
		args: [FFIType.cstring, FFIType.cstring, FFIType.function],
		return: FFIType.void,
	},
	tray_destroy: {
		args: [],
		return: FFIType.void,
	},
});

export class Tray extends EventEmitter {
	private clickCallback?: JSCallback;
	public created = false;

	// biome-ignore lint/complexity/noUselessConstructor: this might be needed to make the clickcallback function idk
	constructor() {
		super();
	}

	create(iconPath: string, name: string) {
		if (this.created) throw new Error("Tray already created!");

		if (!existsSync(iconPath)) {
			throw new Error(`Tray icon not found at: ${iconPath}`);
		}

		this.clickCallback = new JSCallback(
			() => {
				queueMicrotask(() => {
					try {
						this.emit("click");
					} catch (err) {
						console.error("Error in click callback:", err);
					}
				});
			},
			{
				args: [],
				returns: FFIType.void,
			},
		);

		if (!this.clickCallback?.ptr) throw new Error("Callback pointer is null");

		lib.symbols.tray_create(
			encodeCString(iconPath),
			encodeCString(name),
			this.clickCallback.ptr,
		);

		this.created = true;
	}

	destroy() {
		if (!this.created) throw new Error("Tray not created yet");
		lib.symbols.tray_destroy();
		this.created = false;
		this.clickCallback?.close();
		this.clickCallback = undefined;
	}
}
