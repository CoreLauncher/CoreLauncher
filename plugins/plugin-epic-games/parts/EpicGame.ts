import type { GameShape } from "@corelauncher/types";

export default class EpicGame implements GameShape {
	id: string;
	name: string;

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}
}
