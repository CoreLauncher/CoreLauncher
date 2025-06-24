import { dlopen, FFIType, JSCallback, ptr } from "bun:ffi";
import { existsSync } from "node:fs";
import { TypedEmitter } from "tiny-typed-emitter";
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

type TrayEvents = {
	"left-click": () => void;
	"right-click": () => void;
	"middle-click": () => void;
	"double-click": () => void;
};

function encodeCString(value: string) {
	return ptr(new TextEncoder().encode(`${value}\0`));
}

const eventQueue: (() => void)[] = [];

setInterval(() => {
	while (eventQueue.length > 0) {
		const handler = eventQueue.shift();
		handler?.();
	}
}, 16);

const makeCallback = (tray: Tray, event: keyof TrayEvents) =>
	new JSCallback(() => queueMicrotask(() => tray.safeEmit(event)), {
		args: [],
		returns: FFIType.void,
	});

export class Tray extends (TypedEmitter as new () => TypedEmitter<TrayEvents>) {
	private leftClick?: JSCallback;
	private rightClick?: JSCallback;
	private middleClick?: JSCallback;
	private doubleClick?: JSCallback;

	public created = false;

	public safeEmit(event: keyof TrayEvents) {
		eventQueue.push(() => this.emit(event));
	}

	create(name: string, icon: string) {
		if (this.created) throw new Error("Tray already created!");
		if (!existsSync(icon)) throw new Error(`Tray icon not found at: ${icon}`);

		this.leftClick = makeCallback(this, "left-click");
		this.rightClick = makeCallback(this, "right-click");
		this.middleClick = makeCallback(this, "middle-click");
		this.doubleClick = makeCallback(this, "double-click");

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
