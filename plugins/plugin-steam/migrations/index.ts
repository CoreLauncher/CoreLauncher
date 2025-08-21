import type { Migrations } from "@corelauncher/database";

export const migrations: Migrations = [
	await import("./000001_create_accounts_table"),
];
