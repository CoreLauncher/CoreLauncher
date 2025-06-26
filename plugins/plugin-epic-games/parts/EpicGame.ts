import type { GameShape } from "@corelauncher/types";
import open from "open";

type EpicGameOptions = {
	id: string;
	name: string;
};

export default class EpicGame implements GameShape {
	id: string;
	name: string;

	private rawId: string;

	constructor(options: EpicGameOptions) {
		this.id = `epic:${options.id}`;
		this.name = options.name;

		this.rawId = options.id;
	}

	async launch() {
		await open(
			`com.epicgames.launcher://apps/${this.rawId}?action=launch&silent=true`,
		);
		return true;
	}
}
