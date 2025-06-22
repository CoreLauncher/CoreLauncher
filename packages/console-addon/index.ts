import chalk from "chalk";

const oldInfo = console.info;
// biome-ignore lint/suspicious/noExplicitAny: <Its the original type>
console.info = (...args: any[]) => {
	if (args.length === 0) return;
	return oldInfo(chalk.green("🛈 "), ...args);
};

const oldWarn = console.warn;
// biome-ignore lint/suspicious/noExplicitAny: <Its the original type>
console.warn = (...args: any[]) => {
	if (args.length === 0) return;
	return oldWarn(chalk.yellow("⚠ "), ...args);
};

const oldError = console.error;
// biome-ignore lint/suspicious/noExplicitAny: <Its the original type>
console.error = (...args: any[]) => {
	if (args.length === 0) return;
	return oldError("✖ ", ...args);
};
