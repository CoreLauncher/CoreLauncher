import type { GameShape } from "@corelauncher/types";
import open from "open";

type SteamGameOptions = {
	id: number;
	name: string;
};

export default class SteamGame implements GameShape {
	id: string;
	name: string;

	private rawId: number;

	constructor(options: SteamGameOptions) {
		this.id = `steam:${options.id}`;
		this.name = options.name;

		this.rawId = options.id;
	}

	async launch() {
		await open(`steam://launch/${this.rawId}`);
		return true;
	}
}
