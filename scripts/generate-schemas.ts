// import { $ } from "bun";
// await $`ts-json-schema-generator --jsDoc none --path ./packages/steam-client/types/*.ts --out ./packages/steam-client/types/schema.json`;

import { createGenerator } from "ts-json-schema-generator";

const schema = createGenerator({
	path: "./packages/steam-client/types/*.ts",
	tsconfig: "./tsconfig.json",
	type: "*",
}).createSchema();

await Bun.write(
	"./packages/steam-client/types/schema.json",
	JSON.stringify(schema, null, 4),
);

console.log("Schema generated successfully.");
