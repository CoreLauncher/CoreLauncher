import { dlopen, FFIType, JSCallback, ptr } from "bun:ffi";
import { EventEmitter } from "node:events";
import { existsSync } from "node:fs";
import dll from "./tray.dll" with { type: "file" };

const lib = dlopen(dll, {
	tray_create: {
		args: [
			FFIType.cstring, // name
			FFIType.cstring, // icon
			FFIType.function, // left
			FFIType.function, // right
			FFIType.function, // middle
			FFIType.function, // double
		],
		return: FFIType.void,
	},
	tray_destroy: {
		args: [],
		return: FFIType.void,
	},
});

function encodeCString(value: string) {
	return ptr(new TextEncoder().encode(`${value}\0`));
}

export class Tray extends EventEmitter {
	private leftClick?: JSCallback;
	private rightClick?: JSCallback;
	private middleClick?: JSCallback;
	private doubleClick?: JSCallback;

	public created = false;

	// biome-ignore lint/complexity/noUselessConstructor: this might be needed to make the clickcallback function idk
	constructor() {
		super();
	}

	create(name: string, icon: string) {
		if (this.created) throw new Error("Tray already created!");
		if (!existsSync(icon)) throw new Error(`Tray icon not found at: ${icon}`);

		this.leftClick = new JSCallback(
			() => queueMicrotask(() => this.emit("left-click")),
			{
				args: [],
				returns: FFIType.void,
			},
		);

		this.rightClick = new JSCallback(
			() => queueMicrotask(() => this.emit("right-click")),
			{
				args: [],
				returns: FFIType.void,
			},
		);

		this.middleClick = new JSCallback(
			() => queueMicrotask(() => this.emit("middle-click")),
			{
				args: [],
				returns: FFIType.void,
			},
		);

		this.doubleClick = new JSCallback(
			() => queueMicrotask(() => this.emit("double-click")),
			{
				args: [],
				returns: FFIType.void,
			},
		);

		lib.symbols.tray_create(
			encodeCString(name),
			encodeCString(icon),
			this.leftClick.ptr,
			this.rightClick.ptr,
			this.middleClick.ptr,
			this.doubleClick.ptr,
		);

		this.created = true;
	}

	destroy() {
		if (!this.created) throw new Error("Tray not created yet");
		lib.symbols.tray_destroy();

		this.leftClick?.close();
		this.rightClick?.close();
		this.middleClick?.close();
		this.doubleClick?.close();

		this.leftClick =
			this.rightClick =
			this.middleClick =
			this.doubleClick =
				undefined;

		this.created = false;
	}
}
