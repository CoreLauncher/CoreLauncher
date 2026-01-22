import {
	type ListenerSignature,
	TypedEmitter,
} from "@corelauncher/typed-emitter";
import type { PluginPortal } from "../types/PluginPortal";
import type { AccountInstanceShape } from "./AccountInstanceShape";
import type { AccountProviderShape } from "./AccountProviderShape";
import type { GameInstanceShape } from "./GameInstanceShape";
import type { GameProfileShape } from "./GameProfileShape";
import type { GameProviderShape } from "./GameProviderShape";

export interface PluginShapeEvents {
	ready: () => void;
	game_providers_updated: () => void;
	game_instances_updated: () => void;
	game_profiles_updated: () => void;
	account_providers_updated: () => void;
	account_instances_updated: () => void;
}

export abstract class PluginShape<
	L extends ListenerSignature<L> = ListenerSignature<unknown>,
> extends TypedEmitter<PluginShapeEvents & L> {
	abstract gameProviders: GameProviderShape[];
	abstract gameInstances: GameInstanceShape[];
	abstract gameProfiles: GameProfileShape[];
	abstract accountProviders: AccountProviderShape[];
	abstract accountInstances: AccountInstanceShape[];

	constructor(_portal: PluginPortal) {
		super();
	}
}
