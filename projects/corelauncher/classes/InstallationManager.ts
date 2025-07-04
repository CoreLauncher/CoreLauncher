import { spawn } from "node:child_process";
import { join } from "node:path";
import { ensureDir } from "fs-extra";
import * as registry from "native-reg";
import * as ws from "windows-shortcuts";
import { applicationDirectory } from "../util/directories";
import { getVersion } from "../util/version" with { type: "macro" };

function createShortcut(
	path: string,
	options: ws.ShortcutOptions,
): Promise<void> {
	return new Promise((resolve, reject) => {
		ws.create(path, options, (error) => {
			resolve(error ? reject(new Error(error)) : undefined);
		});
	});
}

export default class InstallationManager {
	isExecutable: boolean;

	thisExecutable: string;
	thisDirectory: string;

	applicationDirectory: string;
	applicationExecutable: string;
	constructor() {
		this.isExecutable = Bun.main.endsWith("CoreLauncher.exe");

		this.thisExecutable = process.argv0;
		this.thisDirectory = join(this.thisExecutable, "..");

		this.applicationDirectory = applicationDirectory();
		this.applicationExecutable = join(
			this.applicationDirectory,
			"CoreLauncher.exe",
		);
	}

	async checkInstallation() {
		if (!this.isExecutable)
			return console.warn(
				"Skipping installation check, not running as executable.",
			);

		if (this.thisExecutable === this.applicationExecutable)
			return console.info("CoreLauncher seems to be installed correctly.");

		console.info("Installing CoreLauncher...");

		console.info("Creating application directory...");
		await ensureDir(this.applicationDirectory);

		console.info("Writing executable to application directory...");
		await Bun.write(this.applicationExecutable, Bun.file(this.thisExecutable));

		console.info("Writing registry entries...");
		const key = registry.createKey(
			registry.HKEY.CURRENT_USER,
			"Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\CoreLauncher",
			registry.Access.ALL_ACCESS,
		);

		registry.setValueSZ(key, "DisplayIcon", this.applicationExecutable);
		registry.setValueSZ(key, "DisplayName", "CoreLauncher");
		registry.setValueSZ(key, "DisplayVersion", await getVersion());
		registry.setValueSZ(key, "Publisher", "CoreLauncher Team");
		registry.setValueSZ(key, "HelpLink", "https://corelauncher.app");
		registry.setValueSZ(
			key,
			"InstallDate",
			new Date().toISOString().slice(0, 10),
		); // yyyy-mm-dd
		registry.setValueSZ(key, "InstallLocation", this.applicationDirectory);
		registry.setValueSZ(key, "URLInfoAbout", "https://corelauncher.app");
		registry.setValueSZ(key, "URLUpdateInfo", "https://corelauncher.app");
		registry.setValueDWORD(
			key,
			"EstimatedSize",
			Bun.file(this.thisExecutable).size / 1024,
		);

		registry.closeKey(key);

		console.info("Creating shortcut in Start Menu...");
		const startMenuPath = join(
			process.env.APPDATA || "",
			"Microsoft\\Windows\\Start Menu\\Programs",
			"CoreLauncher",
			"CoreLauncher.lnk",
		);

		await createShortcut(startMenuPath, {
			target: this.applicationExecutable,
			desc: "CoreLauncher",
			icon: this.applicationExecutable,
			workingDir: this.applicationDirectory,
		});

		console.info("Installation complete!");

		spawn(this.applicationExecutable, {
			cwd: this.applicationDirectory,
			detached: true,
		});

		process.exit(0);
	}

	async checkUpdates() {
		if (!this.isExecutable)
			return console.warn("Skipping update check, not running as executable.");
	}
}
