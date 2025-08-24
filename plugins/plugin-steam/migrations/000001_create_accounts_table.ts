import type { Kysely } from "kysely";

export const name = "000001_create_accounts_table";

export async function up(database: Kysely<any>): Promise<void> {
	await database.schema
		.createTable("accounts")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("name", "text", (col) => col.notNull().unique())
		.addColumn("access_token", "text", (col) => col.notNull())
		.addColumn("refresh_token", "text", (col) => col.notNull())
		.execute();
}

export async function down(database: Kysely<any>): Promise<void> {
	await database.schema.dropTable("accounts").execute();
}
