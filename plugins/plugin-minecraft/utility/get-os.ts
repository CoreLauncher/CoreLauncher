export function getOS() {
	const platform = process.platform;
	if (platform === "win32") return "windows";
	if (platform === "darwin") return "osx";
	if (platform === "linux") return "linux";

	throw new Error(`Unknown platform: ${platform}`);
}

/**
 * Returns the operating system for java components.
 * @returns the component name
 */
export function getComponentOS() {
	const platform = process.platform;
	const arch = process.arch;

	if (platform === "linux" && arch === "x64") return "linux";
	if (platform === "linux" && arch === "ia32") return "linux-i386";
	if (platform === "darwin" && arch === "x64") return "osx";
	if (platform === "darwin" && arch === "arm64") return "osx-arm64";
	if (platform === "win32" && arch === "x64") return "windows-x64";
	if (platform === "win32" && arch === "ia32") return "windows-x86";

	throw new Error(`Unknown platform: ${platform} and architecture: ${arch}`);
}
