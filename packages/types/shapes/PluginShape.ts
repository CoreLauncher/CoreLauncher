import {
	type DefaultListener,
	type ListenerSignature,
	TypedEmitter,
} from "@corelauncher/typed-emitter";
import type { PluginPortal } from "../types/PluginPortal";
import type { AccountInstanceShape } from "./AccountInstanceShape";
import type { AccountProviderShape } from "./AccountProviderShape";
import type { GameShape } from "./GameShape";

export interface PluginShapeEvents {
	ready: () => void;
	games: (games: GameShape[]) => void;
	account_providers: (providers: AccountProviderShape[]) => void;
	account_instances: (instances: AccountInstanceShape[]) => void;
}

export abstract class PluginShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<PluginShapeEvents & L> {
	// biome-ignore lint/complexity/noUselessConstructor: no
	constructor(portal: PluginPortal) {
		super();

		// this.once("ready", () => {
		// 	if (this.listeners("ready").length === 1) return;
		// 	setImmediate(() => {
		// 		this.emit("ready");
		// 	});
		// });
	}
}
