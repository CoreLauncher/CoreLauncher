import {
	CString,
	dlopen,
	FFIType,
	JSCallback,
	type Pointer,
	ptr,
} from "bun:ffi";
import { existsSync } from "node:fs";
import { TypedEmitter } from "tiny-typed-emitter";
import dll from "./tray.dll" with { type: "file" };

const lib = dlopen(dll, {
	tray_construct_receiver: {
		args: [],
		returns: FFIType.ptr,
	},
	tray_pump_events: {
		args: [FFIType.ptr, FFIType.function],
		returns: FFIType.void,
	},
	tray_construct: {
		args: [FFIType.cstring],
		returns: FFIType.ptr,
	},
	tray_set_icon: {
		args: [FFIType.ptr, FFIType.ptr],
		returns: FFIType.void,
	},
	tray_set_label: {
		args: [FFIType.ptr, FFIType.ptr],
		returns: FFIType.void,
	},
	tray_set_visibility: {
		args: [FFIType.ptr, FFIType.bool],
		returns: FFIType.void,
	},
	tray_destroy: {
		args: [FFIType.ptr],
		returns: FFIType.void,
	},
});

function encodeCString(value: string) {
	return ptr(new TextEncoder().encode(`${value}\0`));
}

function decodeCString(value: Pointer) {
	return new CString(value).toString();
}

const receiverPtr = lib.symbols.tray_construct_receiver();
const instances: Tray[] = [];

setInterval(() => {
	lib.symbols.tray_pump_events(
		receiverPtr,
		new JSCallback(
			(idPtr: Pointer, eventPtr: Pointer) => {
				const id = decodeCString(idPtr);
				const event = decodeCString(eventPtr);
				const instance = instances.find((i) => i.id === id);
				if (!instance) return;
				if (event !== "Click") return;
				instance.emit("click");
			},
			{
				args: [FFIType.cstring, FFIType.cstring],
				returns: FFIType.void,
			},
		),
	);
}, 1).unref();

export interface TrayEvents {
	click: () => void;
}

export class Tray extends TypedEmitter<TrayEvents> {
	id: string;
	private tray: Pointer | null;
	constructor() {
		super();
		this.id = Bun.randomUUIDv7();
		this.tray = lib.symbols.tray_construct(encodeCString(this.id))!;

		instances.push(this);
	}

	setIcon(path: string) {
		if (!existsSync(path)) throw new Error(`Icon file does not exist: ${path}`);

		const encodedPath = encodeCString(path);
		lib.symbols.tray_set_icon(this.tray, encodedPath);
	}

	setLabel(label: string) {
		const encodedLabel = encodeCString(label);
		lib.symbols.tray_set_label(this.tray, encodedLabel);
	}

	setVisibility(visible: boolean) {
		lib.symbols.tray_set_visibility(this.tray, visible);
	}

	destroy() {
		lib.symbols.tray_destroy(this.tray);
		this.tray = null;

		const index = instances.indexOf(this);
		if (index !== -1) instances.splice(index, 1);

		this.removeAllListeners();
	}
}
