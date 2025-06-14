import { TypedEmitter } from "tiny-typed-emitter";

interface PluginEvents {
	ready: () => void;
}

export default abstract class PluginShape extends TypedEmitter<PluginEvents> {}
