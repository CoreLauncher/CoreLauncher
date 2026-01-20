import { type Option, OptionType } from "@corelauncher/sdk";
import "./OptionRenderer.css";
import { NumberInput } from "@corelauncher/react";
import DropdownInput from "@corelauncher/react/components/input/DropdownInput/DropdownInput";
import clsx from "clsx";

export function OptionRenderer({
	option,
	onChange,
}: {
	option: Option;
	onChange: (id: string, value: string | number | boolean) => void;
}) {
	console.log(option);

	switch (option.type) {
		case OptionType.OptionRow:
			return (
				<div className={clsx("OptionRenderer", "optionrow")}>
					{option.options.map((o) => (
						<OptionRenderer key={o.id} option={o} onChange={onChange} />
					))}
				</div>
			);
		case OptionType.Dropdown:
			return (
				<DropdownInput
					label={option.label}
					default={option.default}
					values={option.values}
					required={option.required}
					disabled={option.disabled}
					onChange={(value) => onChange(option.id, value)}
				/>
			);
		case OptionType.Number:
			return (
				<NumberInput
					label={option.label}
					default={option.default}
					required={option.required}
					disabled={option.disabled}
					minimum={option.minimum}
					maximum={option.maximum}
					onChange={(value) => onChange(option.id, value)}
				/>
			);
	}
}
