import packageJSON from "../../../package.json";

export async function getVersion() {
	return packageJSON.version;
}

// USAGE OF THESE FUNCTIONS IS CRASHING BUN
// https://github.com/oven-sh/bun/issues/20730

// export function getCommit() {
// 	const { stdout } = Bun.spawnSync({
// 		cmd: ["git", "rev-parse", "--short", "HEAD"],
// 		stdout: "pipe",
// 	});
// 	return stdout.toString().trim();
// }

// export function getBranch() {
// 	const { stdout } = Bun.spawnSync({
// 		cmd: ["git", "rev-parse", "--abbrev-ref", "HEAD"],
// 		stdout: "pipe",
// 	});
// 	return stdout.toString().trim();
// }

// export function getBuildDate() {
// 	return new Date().toISOString();
// }
