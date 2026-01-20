import type {
	DefaultListener,
	ListenerSignature,
} from "@corelauncher/typed-emitter";
import { TypedEmitter } from "@corelauncher/typed-emitter";
import type { Option } from "../options";
import type { GameInstanceShape } from "./GameInstanceShape";

export abstract class GameInstanceProviderShape<
	L extends ListenerSignature<L> = DefaultListener,
> extends TypedEmitter<L> {
	abstract createOptions(
		options: Record<string, string | number | boolean>,
	): Option[] | Promise<Option[]>;
	abstract create(
		options: Record<string, string | number | boolean>,
	): GameInstanceShape | null | Promise<GameInstanceShape | null>;
}
