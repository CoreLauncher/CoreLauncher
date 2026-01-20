import clsx from "clsx";
import "./NumberInput.css";
import { type ChangeEventHandler, useId } from "react";

export function NumberInput({
	className,
	name = "",
	label,
	default: value = "",
	placeholder = "",
	minimum,
	maximum,
	onChange,
}: {
	className?: string;
	name?: string;
	label?: string;
	default?: string | number;
	placeholder?: string;
	minimum?: number;
	maximum?: number;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
	const id = useId();

	return (
		<div className={clsx("cl-numberinput", "cl-input-container", className)}>
			{label && (
				<label className="cl-input-label" htmlFor={id}>
					{label}
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
				onChange={onChange}
				onKeyDown={(event) => {
					if (!/[0-9]/.test(event.key)) event.preventDefault();
				}}
			/>
		</div>
	);
}
