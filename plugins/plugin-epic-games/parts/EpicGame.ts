import { GameShape, GameState } from "@corelauncher/types";
import open from "open";
import psList from "ps-list";

type EpicGameOptions = {
	id: string;
	name: string;
	processes: string[];
};

export default class EpicGame extends GameShape {
	id: string;
	name: string;
	state = GameState.Installed;
	iconUrl: null = null;
	bannerUrl: null = null;
	capsuleUrl: null = null;

	private processes: string[];
	private rawId: string;

	constructor(options: EpicGameOptions) {
		super();

		this.id = `epic:${options.id}`;
		this.name = options.name;
		this.processes = options.processes;

		this.rawId = options.id;
	}

	async launch() {
		await open(
			`com.epicgames.launcher://apps/${this.rawId}?action=launch&silent=true`,
		);
		return true;
	}

	async updateState(executables: string[]) {
		const oldState = this.state;
		const found = this.processes.some((proc) => executables.includes(proc));
		this.state = found ? GameState.Running : GameState.Installed;
		if (oldState !== this.state)
			this.emit("state_changed", this.state, oldState);
	}
}
