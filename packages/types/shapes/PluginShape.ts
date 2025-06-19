import { TypedEmitter } from "tiny-typed-emitter";
import type { GameShape } from "./GameShape";
import type { PluginPortal } from "../types/PluginPortal";

interface PluginEvents {
	ready: () => void;
	games: (games: GameShape[]) => void;
}

export abstract class PluginShape extends TypedEmitter<PluginEvents> {
	constructor(portal: PluginPortal) {
		super();
	}
}
