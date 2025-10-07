import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { Octokit } from "@octokit/rest";
import { $ } from "bun";
import { main as pbjs } from "protobufjs-cli/pbjs";

const REPOSITORY_OWNER = "SteamDatabase";
const RESPOSITORY_NAME = "Protobufs";
const REMOTE_PATH = "steam";

const PROTOBUF_PATH = join(
	import.meta.dir,
	"..",
	"packages/steam-client",
	"protobuf/",
);

const DOWNLOAD_PATH = join(PROTOBUF_PATH, "static");

const octokit = new Octokit();
const { data } = await octokit.repos.getContent({
	owner: REPOSITORY_OWNER,
	repo: RESPOSITORY_NAME,
	path: REMOTE_PATH,
});

if (!Array.isArray(data)) throw new Error("Expected data to be an array");

let current = 0;
for (const index in data) {
	const file = data[index]!;
	if (file.type !== "file") continue;
	if (file.download_url === null) continue;

	const response = await fetch(file.download_url);
	const contents = await response.text();

	console.info(`[${++current}/${data.length}] Downloading ${file.name}...`);

	await Bun.write(join(DOWNLOAD_PATH, file.name), contents);
}

const files = await readdir(DOWNLOAD_PATH).then((files) =>
	files.map((file) => join(DOWNLOAD_PATH, file)),
);

console.log("Running PBJS...");
pbjs([
	"-t",
	"static",
	"-w",
	"es6",
	"-o",
	join(PROTOBUF_PATH, "compiled.js"),
	...files,
]);
console.log("PBJS complete.");

console.log("Running PBTS... (this may take a while)");
await $`bun pbts ${join(PROTOBUF_PATH, "compiled.js")} -o ${join(
	PROTOBUF_PATH,
	"compiled.d.ts",
)}`;
console.log("PBTS complete.");
console.log("All done!");
