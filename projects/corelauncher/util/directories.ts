import { join } from "node:path";

export function applicationDirectory() {
	if (process.env.CORELAUNCHER_APP_DIR) return process.env.CORELAUNCHER_APP_DIR;
	if (process.env.NODE_ENV === "development")
		return join(process.cwd(), ".data");

	throw new Error("No valid application directory found.");
}

export function pluginDataDirectory() {
	return join(applicationDirectory(), "plugins_data");
}
