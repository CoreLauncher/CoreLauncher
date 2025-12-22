import temporaryDirectory from "temp-dir";
import scriptVBS from "./script.vbs" with { type: "file" };

type ShortcutOptions = {
	outputPath: string;
	targetPath: string;
	cwd?: string;
	comment?: string;
	iconPath?: string;
	iconIndex?: number;
	args?: string;
};

export default async function createShortcut(options: ShortcutOptions) {
	const temporaryVBSPath = `${temporaryDirectory}/corelauncher-create-shortcut.vbs`;

	await Bun.write(temporaryVBSPath, Bun.file(scriptVBS));

	const icon = options.iconPath
		? `${options.iconPath},${options.iconIndex ?? 0}`
		: "";

	const vbsArguments = [
		temporaryVBSPath,

		options.outputPath,
		options.targetPath,
		options.args ?? "",
		options.comment ?? "",
		options.cwd ?? "",
		icon,
		1, // Windowmode
		"", // Hotkey
	] as string[];

	const process = Bun.spawn(["wscript", ...vbsArguments], {
		stdout: "pipe",
		stderr: "pipe",
	});

	await process.exited;
}
