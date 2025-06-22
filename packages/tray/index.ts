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

lib.symbols.tray_create();
