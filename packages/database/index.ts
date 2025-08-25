import { Database } from "bun:sqlite";
import { relative } from "node:path";
import { isProduction } from "@corelauncher/is-production";
import { CamelCasePlugin, Kysely, type Migration, Migrator } from "kysely";
import { BunSqliteDialect } from "kysely-bun-sqlite";

export type NamedMigration = {
	name: string;
} & Migration;

export type Migrations = NamedMigration[];

export default async function createDatabase<Schema>(
	file: string,
	migrations: NamedMigration[],
) {
	const database = new Kysely<Schema>({
		plugins: [new CamelCasePlugin()],
		dialect: new BunSqliteDialect({
			database: new Database(file),
		}),
	});

	const migrator = new Migrator({
		db: database,
		provider: {
			getMigrations: async () => {
				return Object.fromEntries(
					migrations.map((migration) => [migration.name, migration]),
				);
			},
		},
	});

	const availableMigrations = await migrator.getMigrations();
	const pendingMigrations = availableMigrations.filter(
		(migration) => !migration.executedAt,
	);

	if (pendingMigrations.length === 0) return database;

	if (!isProduction) {
		alert(
			`The following migrations are pending (./${relative(".", file)}):\n${pendingMigrations.map((migration) => ` - ${migration.name}`).join("\n")}\nDo you want to execute them?`,
		);
	}

	for (const migration of pendingMigrations) {
		const migrationName = migration.name;
		const result = await migrator.migrateTo(migration.name);
		if (result.error) {
			console.error(`Migration to ${migrationName} failed`);
			console.error(result.error);
			process.exit(1);
		}
		console.info(`Migrated to ${migrationName}`);
	}

	return database;
}
