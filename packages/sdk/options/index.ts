export enum OptionType {
	OptionRow = "option_row",
	Dropdown = "dropdown",
}

export type Option =
	| {
			id: string;
			label: string;
			type: OptionType.OptionRow;
			options: Option[];
	  }
	| {
			id: string;
			label: string;
			type: OptionType.Dropdown;
			default: string;
			disabled?: boolean;
			required?: boolean;
			values: {
				label: string;
				value: string;
			}[];
	  };

export function getRequired(options: Option[]) {
	const required: string[] = [];

	for (const option of options) {
		if (option.type === OptionType.OptionRow)
			required.push(...getRequired(option.options));

		if ("required" in option && option.required) required.push(option.id);
	}

	return required;
}

export function getDefaults(options: Option[]) {
	let defaults: Record<string, string | number | boolean> = {};

	for (const option of options) {
		if (option.type === OptionType.OptionRow)
			defaults = {
				...defaults,
				...getDefaults(option.options),
			};

		if ("default" in option && option.default)
			defaults[option.id] = option.default;
	}

	return defaults;
}
