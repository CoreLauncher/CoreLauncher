import clsx from "clsx";
import "./NumberInput.css";
import { type ChangeEventHandler, useId } from "react";

export function NumberInput({
	className,
	name = "",
	default: value = "",
	placeholder = "",
	minimum,
	maximum,
	onChange,
}: {
	className?: string;
	name?: string;
	default?: string | number;
	placeholder?: string;
	minimum?: number;
	maximum?: number;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
	const id = useId();

	return (
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
			onKeyPress={(event) => {
				if (!/[0-9]/.test(event.key)) event.preventDefault();
			}}
		/>
	);
}
