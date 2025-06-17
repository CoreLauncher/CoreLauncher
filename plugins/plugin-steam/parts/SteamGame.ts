import type { GameShape } from "@corelauncher/types";

export default class SteamGame implements GameShape {
	id: string;
	name: string;

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}
}
