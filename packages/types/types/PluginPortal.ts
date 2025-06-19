import type { GameShape } from "../shapes/GameShape";

export abstract class PluginPortal {
	abstract getGames(): GameShape[];
}
