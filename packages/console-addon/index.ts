import chalk, { type ChalkInstance } from "chalk";

const ICON_INFO = "i";
const ICON_WARN = "w";
const ICON_ERROR = "x";
const ICON_ALERT = "?";

const COLOR_INFO = chalk.hex("008000");
const COLOR_WARN = chalk.hex("ffff00");
const COLOR_ERROR = chalk.hex("ff0000");
const COLOR_ALERT = chalk.hex("00ffff");

const TREE_BRANCH = "┣";
const TREE_END = "┗";

function format(options: {
	icon: string;
	color: ChalkInstance;

	// biome-ignore lint/suspicious/noExplicitAny: We can render anything
	message: any[];
}) {
	const { icon, color, message } = options;
	const joined = message
		.map((m) => {
			if (typeof m === "string") return m;
			return Bun.inspect(m, { colors: true });
		})
		.join(" ");

	const lines = joined.split("\n");

	for (const index in lines) {
		const line = lines[index];
		const isFirst = index === "0";
		const isLast = Number.parseInt(index, 10) === lines.length - 1;

		let prefix = color(TREE_BRANCH);
		if (isLast) prefix = color(TREE_END);
		if (isFirst) prefix = color(icon);

		lines[index] = `${prefix} ${line}`;
	}

	return lines.join("\n");
}

const oldInfo = console.info;
// biome-ignore lint/suspicious/noExplicitAny: <Its the original type>
console.info = (...args: any[]) => {
	if (args.length === 0) return;
	return oldInfo(
		format({
			icon: ICON_INFO,
			color: COLOR_INFO,
			message: args,
		}),
	);
};

const oldWarn = console.warn;
// biome-ignore lint/suspicious/noExplicitAny: <Its the original type>
console.warn = (...args: any[]) => {
	if (args.length === 0) return;
	return oldWarn(
		format({
			icon: ICON_WARN,
			color: COLOR_WARN,
			message: args,
		}),
	);
};

const oldError = console.error;
// biome-ignore lint/suspicious/noExplicitAny: <Its the original type>
console.error = (...args: any[]) => {
	if (args.length === 0) return;
	return oldError(
		format({
			icon: ICON_ERROR,
			color: COLOR_ERROR,
			message: args,
		}),
	);
};

const oldAlert = globalThis.alert;
globalThis.alert = (message?: string) => {
	return oldAlert(
		format({
			icon: ICON_ALERT,
			color: COLOR_ALERT,
			message: [message ?? ""],
		}),
	);
};
