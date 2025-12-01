import { existsSync, mkdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { Octokit } from "@octokit/rest";
import { spawnSync } from "bun";
import "@corelauncher/console-addon";

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
const GENERATED_PATH = join(PROTOBUF_PATH, "generated");

if (!existsSync(DOWNLOAD_PATH)) mkdirSync(DOWNLOAD_PATH, { recursive: true });
if (!existsSync(GENERATED_PATH)) mkdirSync(GENERATED_PATH, { recursive: true });

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

const plugin = join(
	__dirname,
	"..",
	"node_modules",
	".bin",
	process.platform === "win32"
		? "protoc-gen-ts_proto.exe"
		: "protoc-gen-ts_proto",
);

console.log("Compiling protobuffers to TypeScript...");

const command = [
	`bun`,
	`protoc`,
	`--proto_path=${DOWNLOAD_PATH}`,
	`--plugin=${plugin}`,
	`--ts_proto_opt=env=node`,
	`--ts_proto_opt=outputJsonMethods=false`,
	`--ts_proto_opt=outputPartialMethods=false`,
	`--ts_proto_opt=forceLong=bigint`,
	`--ts_proto_out=${GENERATED_PATH}`,
	...files,
];

const result = spawnSync({ cmd: command });
console.log(result.stdout.toString());
console.log(result.stderr.toString());

console.info("All protobufs have been compiled!");
