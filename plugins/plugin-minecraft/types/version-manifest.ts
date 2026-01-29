import type { Rule } from "./rule";

type Argument =
	| {
			value: string;
			rules: Rule[];
	  }
	| string;

type Download = { sha1: string; size: number; url: string };

export type MinecraftVersionManifest = {
	arguments: {
		game: Argument[];
		jvm: Argument[];
	};
	assetIndex: {
		id: string;
		sha1: string;
		size: number;
		totalSize: number;
		url: string;
	};
	assets: string;
	complianceLevel: number;
	downloads: {
		client: Download;
	};
	id: string;
	javaVersion: unknown;
	libraries: {
		name: string;
		downloads: {
			artifact: { path: string; sha1: string; size: number; url: string };
		};
		rules?: Rule[];
	}[];
	logging: unknown;
	mainClass: string;
	minimumLauncherVersion: number;
	releaseTime: string;
	time: string;
	type: string;
};
