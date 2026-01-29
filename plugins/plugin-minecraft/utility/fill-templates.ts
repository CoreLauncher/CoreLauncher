export function fillTemplates(str: string, values: Record<string, string>) {
	for (const [key, value] of Object.entries(values)) {
		const template = `\${${key}}`;
		str = str.replaceAll(template, value);
	}

	return str;
}
