import type { AccountInstanceShape } from "@corelauncher/types";

export default class SteamAccountInstance implements AccountInstanceShape {
	id: string;
	name: string;
	providerId = "steam";
	constructor(data: {
		id: number;
		name: string;
		access_token: string;
		refresh_token: string;
	}) {
		this.id = `steam:${data.id}`;
		this.name = data.name;
	}
}
