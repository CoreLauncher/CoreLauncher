import { GameFeature, GameInstanceShape, GameState } from "@corelauncher/sdk";
import open from "open";

type EpicGameOptions = {
	id: string;
	name: string;
	processes: string[];
};

export default class EpicGameInstance extends GameInstanceShape {
	id: string;
	name: string;
	features = [GameFeature.NormalLaunch];
	state = GameState.Installed;
	iconUrl = null;
	bannerUrl = null;
	capsuleUrl = null;

	provider = "epic-games";

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

	updateState(executables: string[]) {
		const oldState = this.state;
		const found = this.processes.some((proc) => executables.includes(proc));
		this.state = found ? GameState.Running : GameState.Installed;
		return oldState !== this.state;
	}

	createProfileOptions() {
		return [];
	}

	createProfile() {
		return undefined;
	}
}
