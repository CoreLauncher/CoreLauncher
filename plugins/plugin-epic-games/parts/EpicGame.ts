import { GameShape, GameState } from "@corelauncher/types";
import open from "open";

type EpicGameOptions = {
	id: string;
	name: string;
};

export default class EpicGame extends GameShape {
	id: string;
	name: string;
	state = GameState.Installed;
	iconUrl: null = null;
	bannerUrl: null = null;
	capsuleUrl: null = null;

	private rawId: string;

	constructor(options: EpicGameOptions) {
		super();

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
