import type { Kysely } from "kysely";

export const name = "000002_create_profiles_table";

export async function up(database: Kysely<any>): Promise<void> {
	await database.schema
		.createTable("profiles")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().autoIncrement().notNull(),
		)
		.addColumn("name", "text", (col) => col.notNull().unique())
		.addColumn("game_version", "text", (col) => col.notNull())
		.addColumn("loader_type", "text", (col) => col.notNull())
		.addColumn("loader_version", "text", (col) => col)
		.addColumn("ram_amount", "integer", (col) => col.notNull())
		.addColumn("ram_unit", "text", (col) => col.notNull())
		.execute();
}

export async function down(database: Kysely<any>): Promise<void> {
	await database.schema.dropTable("accounts").execute();
}
