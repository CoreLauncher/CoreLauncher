import { TypedEmitter } from "tiny-typed-emitter";
import type { PluginPortal } from "../types/PluginPortal";
import type { GameShape } from "./GameShape";

interface PluginEvents {
	ready: () => void;
	games: (games: GameShape[]) => void;
}

export abstract class PluginShape extends TypedEmitter<PluginEvents> {
	// biome-ignore lint/correctness/noUnusedFunctionParameters: <Its for typing>
	constructor(portal: PluginPortal) {
		super();
	}
}
