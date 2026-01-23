import type { Generated } from "kysely";

export interface Database {
	accounts: {
		id: string;
		name: string;
		accessToken: string;
		refreshToken: string;
		expiresAt: number;
	};
	profiles: {
		id: Generated<number>;
		name: string;
		gameVersion: string;
		loaderType: "vanilla" | "fabric";
		loaderVersion: string | null;
		ramAmount: number;
		ramUnit: "gib" | "mib";
	};
}
