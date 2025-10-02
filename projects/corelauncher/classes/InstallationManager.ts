import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { isProduction } from "@corelauncher/is-production";
import { Octokit } from "@octokit/rest";
import type { SupportedCryptoAlgorithms } from "bun";
import {
	close,
	createReadStream,
	ensureDir,
	ensureDirSync,
	existsSync,
	open,
	removeSync,
	write,
} from "fs-extra";
import * as registry from "native-reg";
import prettyBytes from "pretty-bytes";
import * as ws from "windows-shortcuts";
import packageJSON from "../../../package.json";
import { applicationDirectory } from "../util/directories";

function error() {
	console.error("Something in the updating process failed.");
	console.error(
		"If you see this message multiple times, please report it on GitHub (https://github.com/CoreLauncher/CoreLauncher) and manually reinstall.",
	);
	alert("Press Enter to continue...");
	return;
}

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

function getOS() {
	const platform = process.platform;
	if (platform === "win32") return "windows";
	if (platform === "darwin") return "macos";
	if (platform === "linux") return "linux";
	return "unknown";
}

function getArchitecture() {
	const arch = process.arch;
	if (arch === "x64") return "x64";
	if (arch === "arm64") return "arm64";
	if (arch === "ia32") return "x86";
	return "unknown";
}

async function fetchLatestRelease() {
	try {
		const octokit = new Octokit();
		const { data } = await octokit.rest.repos.getLatestRelease({
			owner: "CoreLauncher",
			repo: "CoreLauncher",
		});

		return data;
	} catch (error) {
		console.error("Failed to fetch latest release:", error);
		return false;
	}
}

async function hashFile(
	file: string,
	algorithm: SupportedCryptoAlgorithms = "sha256",
) {
	const hasher = new Bun.CryptoHasher(algorithm);
	const reader = createReadStream(file, { highWaterMark: 1024 * 8 });

	for await (const chunk of reader) {
		hasher.update(chunk);
	}

	return hasher.digest("hex");
}

const BINARY_ASSET_NAME = `corelauncher-app-${getOS()}-${getArchitecture()}${
	process.platform === "win32" ? ".exe" : ""
}`;

export default class InstallationManager {
	isExecutable: boolean;

	thisExecutable: string;
	thisDirectory: string;

	updateExecutable: string;
	isUpdateExecutable: boolean;

	applicationDirectory: string;
	applicationExecutable: string;
	constructor() {
		this.isExecutable = !!Bun.main.search("~BUN/root/");

		const isBun =
			process.argv0.endsWith("\\bun.exe") ||
			process.argv0.endsWith("/bun") ||
			process.argv0 === "bun";

		this.thisExecutable = isBun ? "./corelauncher.exe" : process.argv0;
		this.thisDirectory = resolve(join(this.thisExecutable, ".."));

		this.updateExecutable = resolve(
			join(
				this.thisDirectory,
				`corelauncher.update${process.platform === "win32" ? ".exe" : ""}`,
			),
		);
		this.isUpdateExecutable = this.thisExecutable === this.updateExecutable;

		this.applicationDirectory = resolve(applicationDirectory());
		this.applicationExecutable = resolve(
			join(this.applicationDirectory, "corelauncher.exe"),
		);

		console.info("Corelauncher Version:", packageJSON.version);
		console.info("Operating System:", getOS(), getArchitecture());
		console.info("Arguments:", Bun.argv, process.argv);
		console.info("Is Executable:", this.isExecutable);
		console.info("This Executable:", resolve(this.thisExecutable));
		console.info("This Directory:", resolve(this.thisDirectory));
		console.info("Update Executable:", resolve(this.updateExecutable));
		console.info("Is Update Executable:", this.isUpdateExecutable);
		console.info("Application Directory:", resolve(this.applicationDirectory));
		console.info(
			"Application Executable:",
			resolve(this.applicationExecutable),
		);

		ensureDirSync(this.applicationDirectory);
		if (existsSync(this.updateExecutable) && !this.isUpdateExecutable) {
			console.info("Removing leftover update executable...");
			removeSync(this.updateExecutable);
		}
	}

	/**
	 * Checks if CoreLauncher is installed, and installs it if not.
	 */
	async checkInstall() {
		if (!isProduction)
			return console.warn(
				"Skipping installation check, not in production mode.",
			);

		if (!this.isExecutable)
			return console.warn(
				"Skipping installation check, not running as executable.",
			);

		if (this.thisExecutable === this.applicationExecutable)
			return console.info("CoreLauncher seems to be installed correctly.");

		return this.install();
	}

	/**
	 * Installs CoreLauncher to the application directory.
	 */
	async install() {
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
		registry.setValueSZ(key, "DisplayVersion", packageJSON.version);
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
			"CoreLauncher.lnk",
		);

		await createShortcut(resolve(startMenuPath), {
			target: this.applicationExecutable,
			desc: "CoreLauncher",
			icon: this.applicationExecutable,
			workingDir: this.applicationDirectory,
		});

		console.info("Registering corelauncher:// protocol handler...");
		const protocolKey = registry.createKey(
			registry.HKEY.CURRENT_USER,
			"Software\\Classes\\corelauncher",
			registry.Access.ALL_ACCESS,
		);

		registry.setValueSZ(protocolKey, "", "URL:CoreLauncher Protocol");
		registry.setValueSZ(protocolKey, "URL Protocol", "");

		const commandKey = registry.createKey(
			protocolKey,
			"shell\\open\\command",
			registry.Access.ALL_ACCESS,
		);

		registry.setValueSZ(
			commandKey,
			"",
			`"${this.applicationExecutable}" protocol "%1"`,
		);

		registry.closeKey(commandKey);
		registry.closeKey(protocolKey);

		console.info("Installation complete!");

		spawn(this.applicationExecutable, process.argv.slice(2), {
			cwd: this.applicationDirectory,
			detached: true,
			shell: true,
		});

		process.exit(0);
	}

	/**
	 * Checks if this binary can be updated.
	 */
	async checkUpdate() {
		if (!isProduction)
			return console.warn("Skipping update check, not in production mode.");

		if (!this.isExecutable)
			return console.warn("Skipping update check, not running as executable.");

		return this.update();
	}

	/**
	 * Updates CoreLauncher if a new version is available.
	 */
	async update() {
		console.info("Checking for updates...");
		const version = packageJSON.version;
		const latest = await fetchLatestRelease();
		if (!latest) return error();
		if (Bun.semver.order(latest.tag_name, version) !== 1)
			return console.info(`CoreLauncher is up to date!`);

		console.info(
			`A new version of CoreLauncher is available: ${latest.tag_name} (you have v${version})`,
		);

		const binaryAsset = latest.assets.find((a) => a.name === BINARY_ASSET_NAME);

		if (!binaryAsset) {
			console.error("Failed to find suitable update assets.");
			return error();
		}

		const binaryFile = await open(this.updateExecutable, "w+");
		const binaryResponse = await fetch(binaryAsset.browser_download_url);
		const reader = binaryResponse.body!.getReader();
		let receivedLength = 0;

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			await write(binaryFile, value);
			receivedLength += value.length;
			process.stdout.write(
				`\rDownloading update... ${prettyBytes(receivedLength)} / ${prettyBytes(
					binaryAsset.size,
				)} (${Math.floor((receivedLength / binaryAsset.size) * 100)}%)`,
			);
		}

		process.stdout.write("\n");

		await close(binaryFile);

		console.info("Update downloaded and applied to temporary file.");
		console.info("Verifying update integrity...");
		const updateHash = await hashFile(this.updateExecutable);
		const expectedHash = binaryAsset.digest?.split(":")[1];
		console.info(`Actual hash:   ${updateHash}`);
		console.info(`Expected hash: ${expectedHash}`);
		console.info(`Actual size:   ${Bun.file(this.updateExecutable).size}`);
		console.info(`Expected size: ${binaryAsset.size}`);
		console.info("Hashes match: ", updateHash === expectedHash);

		if (updateHash !== expectedHash) {
			console.error("Hash mismatch! Update failed.");
			return error();
		}

		console.info("Update verified successfully!");
		console.info(`Spawning update executable... (${this.updateExecutable})`);

		spawn(this.updateExecutable, process.argv.slice(2), {
			cwd: this.thisDirectory,
			detached: true,
			shell: true,
		});

		process.exit(0);
	}

	/**
	 * Checks if updates need to be applied.
	 */
	async checkApply() {
		if (!this.isUpdateExecutable) return;

		return this.apply();
	}

	/**
	 * Applies updates.
	 */
	async apply() {
		console.info("Applying update...");

		await this.install();
	}
}
