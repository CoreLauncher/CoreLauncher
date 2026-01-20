import { useId } from "react";
import "./DropdownInput.css";
import clsx from "clsx";
import { RequiredIndicator } from "../../other/RequiredIndicator/RequiredIndicator";

export default function DropdownInput({
	label,
	default: defaultValue,
	values,
	required,
	disabled,
	onChange,
}: {
	label?: string;
	default?: string;
	values: {
		label: string;
		value: string;
	}[];
	required?: boolean;
	disabled?: boolean;
	onChange?: (value: string) => void;
}) {
	const id = useId();

	return (
		<div className={clsx("cl-dropdown-input", "cl-input-container")}>
			{label && (
				<label className="cl-input-label" htmlFor={id}>
					{label} <RequiredIndicator visible={required} />
				</label>
			)}
			<select
				className="cl-input"
				id={id}
				defaultValue={defaultValue}
				required={required}
				disabled={disabled}
				onChange={(e) => onChange?.(e.target.value)}
			>
				{values.map((item) => (
					<option key={item.value} value={item.value}>
						{item.label}
					</option>
				))}
			</select>
		</div>
	);
}
