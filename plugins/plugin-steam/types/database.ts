import type { Generated } from "kysely";

export interface Database {
	accounts: {
		id: Generated<number>;
		name: string;
		accessToken: string;
		refreshToken: string;
	};
}
