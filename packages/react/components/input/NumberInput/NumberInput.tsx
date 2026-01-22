import clsx from "clsx";
import "./NumberInput.css";
import { useId } from "react";
import { RequiredIndicator } from "../../other/RequiredIndicator/RequiredIndicator";

export function NumberInput({
	className,
	name = "",
	label,
	default: value = "",
	placeholder = "",
	required,
	disabled,
	minimum,
	maximum,
	onChange,
}: {
	className?: string;
	name?: string;
	label?: string;
	default?: string | number;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	minimum?: number;
	maximum?: number;
	onChange?: (value: number) => void;
}) {
	const id = useId();

	return (
		<div className={clsx("cl-numberinput", "cl-input-container", className)}>
			{label && (
				<label className="cl-input-label" htmlFor={id}>
					{label} <RequiredIndicator visible={required} />
				</label>
			)}
			<input
				className={clsx("cl-numberinput", "cl-input", className)}
				type="number"
				id={id}
				name={name}
				defaultValue={value}
				min={minimum}
				max={maximum}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				onChange={(event) => onChange?.(Number(event.target.value))}
				onKeyDown={(event) => {
					if (!/[0-9]/.test(event.key)) event.preventDefault();
				}}
			/>
		</div>
	);
}
