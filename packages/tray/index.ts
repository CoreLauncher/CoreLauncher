import { dlopen, FFIType, JSCallback, ptr } from "bun:ffi";
import dll from "./tray.dll" with { type: "file" };

function encodeCString(value: string) {
	return ptr(new TextEncoder().encode(`${value}\0`));
}

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

export class Tray {
	private clickCallback?: JSCallback;
	public created = false;

	onClick(callback: () => void) {
		if (!this.created) throw new Error("Tray not created yet");
		if (this.clickCallback) this.clickCallback.close();

		this.clickCallback = new JSCallback(callback, {
			args: [],
			returns: FFIType.void,
		});

		if (!this.clickCallback.ptr) throw new Error("Callback pointer is null");
		lib.symbols.tray_register_click_callback(this.clickCallback.ptr);
	}

	create(iconPath: string, name: string) {
		if (this.created) throw new Error("Tray already created!");
		const encodedPath = encodeCString(iconPath);
		const encodedName = encodeCString(name);

		lib.symbols.tray_create(encodedPath, encodedName);
		this.created = true;
	}

	destroy() {
		if (!this.created) throw new Error("Tray not created yet");
		lib.symbols.tray_destroy();
		this.created = false;
	}
}
