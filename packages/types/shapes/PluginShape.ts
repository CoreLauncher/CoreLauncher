import { TypedEmitter } from "tiny-typed-emitter";
import type GameShape from "./GameShape";

interface PluginEvents {
	ready: () => void;
	games: (games: GameShape[]) => void;
}

export default abstract class PluginShape extends TypedEmitter<PluginEvents> {}
