import { spawn } from "node:child_process";
import { isProduction } from "@corelauncher/is-production";
import { env } from "bun";

export default function hideConsole() {
	if (!isProduction) return;
	if (env.CORELAUNCHER_CONSOLE_HIDDEN === "true") return;

	spawn(process.argv0, {
		cwd: process.cwd(),
		detached: true,
		env: {
			...process.env,
			CORELAUNCHER_CONSOLE_HIDDEN: "true",
		},
	});

	process.exit(0);
}
