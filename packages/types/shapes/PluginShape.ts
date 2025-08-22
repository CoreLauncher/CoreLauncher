import { TypedEmitter } from "tiny-typed-emitter";
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

export abstract class PluginShape extends TypedEmitter<PluginShapeEvents> {
	// biome-ignore lint/correctness/noUnusedFunctionParameters: <Its for typing>
	constructor(portal: PluginPortal) {
		super();
	}
}
