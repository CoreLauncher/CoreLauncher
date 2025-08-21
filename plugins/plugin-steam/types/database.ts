import type { Generated } from "kysely";

export interface Database {
	accounts: {
		id: Generated<number>;
		name: string;
		access_token: string;
		refresh_token: string;
	};
}
