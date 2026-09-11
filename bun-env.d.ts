interface Window {
	ipc: {
		postMessage(message: string): void;
	};
}

declare module "*.svg" {
	const path: `${string}.svg`;
	export = path;
}

declare module "*.css" {}
