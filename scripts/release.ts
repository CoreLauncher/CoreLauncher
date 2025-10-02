import "@corelauncher/console-addon";
import { existsSync, mkdirSync } from "node:fs";
import { $ } from "bun";
import packageJSON from "../package.json";

const commit = await $`git rev-parse --short HEAD`.text();
const branch = await $`git rev-parse --abbrev-ref HEAD`.text();
const date = new Date().toISOString();

const defineOptions = {
	"process.env.NODE_ENV": '"production"',
	"process.env.CORELAUNCHER_BUILD_COMMIT": `"${commit.trim()}"`,
	"process.env.CORELAUNCHER_BUILD_BRANCH": `"${branch.trim()}"`,
	"process.env.CORELAUNCHER_BUILD_DATE": `"${date}"`,
};

const windowsOptions = {
	title: "CoreLauncher",
	publisher: "CoreByte & Contributors",
	version: "0.0.0.0",
	description: "CoreLauncher",
	copyright: "CoreByte & Contributors",
	hideConsole: true,
	icon: "./icon.ico",
};

console.info("Creating dist folder...");
if (!existsSync(".dist")) mkdirSync(".dist");

console.info("Building windows x64 executable...");
await Bun.build({
	entrypoints: ["./projects/corelauncher/index.ts"],
	outdir: ".dist",
	define: defineOptions,
	compile: {
		windows: windowsOptions,
		target: "bun-windows-x64",
		outfile: "corelauncher-app-windows-x64.exe",
	},
});

// console.info("Building linux x64 executable...");
// await Bun.build({
// 	entrypoints: ["./projects/corelauncher/index.ts"],
// 	outdir: ".dist",
// 	define: defineOptions,
// 	compile: {
// 		target: "bun-linux-x64",
// 		outfile: "corelauncher-app-linux-x64",
// 	},
// });

console.info(`Build of version ${packageJSON.version} finished.`);
