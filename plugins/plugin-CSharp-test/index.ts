import {
	PluginClass,
	type PluginPortal,
	type PluginShape,
} from "@corelauncher/types";
import { spawn } from "node:child_process";
import path from "node:path";

export const id = "plugin-C#-test";
export const format = 1;
export const name = "C# Test Plugin";
export const description = "Test C# plugin that logs games after 10s.";

export class Plugin extends PluginClass implements PluginShape {
	constructor(portal: PluginPortal) {
		super();

		const exePath = path.join(__dirname, "program.exe");

		const proc = spawn(exePath);

		const games = portal.getGames();
		proc.stdin.write(JSON.stringify(games));
		proc.stdin.end();

		proc.stdout.on("data", (data) => {
			console.log("[C#]", data.toString());
		});

		proc.stderr.on("data", (err) => {
			console.error("[C# error]", err.toString());
		});

		proc.on("close", () => {
			this.emit("ready");
		});
	}
}
