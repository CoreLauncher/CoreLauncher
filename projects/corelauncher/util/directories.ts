import { join } from "node:path";
import { isProduction } from "@corelauncher/is-production";
import { existsSync } from "fs-extra";

export function applicationDirectory() {
	const thisBinary = process.execPath;
	const thisDirectory = join(thisBinary, "..");

	console.log(
		thisBinary,
		thisDirectory,
		thisDirectory.endsWith(".corelauncher"),
	);

	if (process.env.CORELAUNCHER_APP_DIR) return process.env.CORELAUNCHER_APP_DIR;
	if (thisDirectory.endsWith(".corelauncher")) return thisDirectory;
	if (!isProduction) return join(process.cwd(), ".corelauncher");
	if (process.platform === "win32") {
		const appdata = process.env.APPDATA || "";
		if (!existsSync(appdata))
			throw new Error("APPDATA environment variable is not set or invalid.");

		return join(appdata, ".corelauncher");
	}

	throw new Error("No valid application directory found.");
}

export function pluginDataDirectory() {
	return join(applicationDirectory(), "plugins_data");
}
