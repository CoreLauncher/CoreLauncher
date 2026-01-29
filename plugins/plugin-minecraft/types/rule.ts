export type Rule = {
	action: "allow" | "disallow";
	os?: { name: "windows" | "osx" | "linux" };
};
