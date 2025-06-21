import { $ } from "bun";
import rcedit from "rcedit";

const shortComitHash = await $`git rev-parse --short HEAD`.text();

await $`bun build --target=bun --outfile CoreLauncher.exe --sourcemap=inline --compile ./projects/corelauncher/index.ts`;

console.log("CoreLauncher.exe built successfully.");

await rcedit("CoreLauncher.exe", {
	icon: "./icon.ico",
	"file-version": "0.0.0.0",
	"product-version": shortComitHash.trim(), //"0.0.0.0",
	"version-string": {
		Comments: "CoreLauncher",
		CompanyName: "CoreLauncher",
		FileDescription: "CoreLauncher",
		InternalFilename: "CoreLauncher",
		LegalCopyright: "© CoreLauncher",
		OriginalFilename: "CoreLauncher.exe",
		ProductName: "CoreLauncher",
	},
});

console.log("Set Commit hash to", shortComitHash.trim());
console.log("CoreLauncher.exe icon set successfully.");
