export function getOS() {
	const platform = process.platform;
	if (platform === "win32") return "windows";
	if (platform === "darwin") return "osx";
	if (platform === "linux") return "linux";
	return "unknown";
}
