import type {
	DefaultListener,
	ListenerSignature,
} from "@corelauncher/typed-emitter";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { GameInstanceShape } from "./GameInstanceShape";

export abstract class GameInstanceProviderShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<L> {
	abstract create(): GameInstanceShape;
}
