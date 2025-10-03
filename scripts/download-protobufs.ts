import { join } from "node:path";
import { Octokit } from "@octokit/rest";

const REPOSITORY_OWNER = "SteamDatabase";
const RESPOSITORY_NAME = "Protobufs";
const REMOTE_PATH = "steam";
const DOWNLOAD_PATH = join(
	import.meta.dir,
	"..",
	"packages/steam-client",
	"protobuf/static",
);

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
