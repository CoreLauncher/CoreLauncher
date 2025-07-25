import { join } from "node:path";
import { isProduction } from "@corelauncher/is-production";
import { existsSync } from "fs-extra";

export function applicationDirectory() {
	if (process.env.CORELAUNCHER_APP_DIR) return process.env.CORELAUNCHER_APP_DIR;
	if (!isProduction) return join(process.cwd(), ".CoreLauncher");
	if (process.platform === "win32") {
		const appdata = process.env.APPDATA || "";
		if (!existsSync(appdata))
			throw new Error("APPDATA environment variable is not set or invalid.");

		return join(appdata, ".CoreLauncher");
	}

	throw new Error("No valid application directory found.");
}

export function pluginDataDirectory() {
	return join(applicationDirectory(), "plugins_data");
}
