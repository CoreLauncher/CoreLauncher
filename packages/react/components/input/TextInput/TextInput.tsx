import clsx from "clsx";
import "./TextInput.css";
import { type ChangeEventHandler, useId } from "react";

export function TextInput({
	className,
	isPassword = false,
	name = "",
	default: value = "",
	placeholder = "",
	onChange,
}: {
	className?: string;
	isPassword?: boolean;
	name?: string;
	default?: string;
	placeholder?: string;
	onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
	const id = useId();

	return (
		<input
			className={clsx("cl-textinput", "cl-input", className)}
			type={isPassword ? "password" : "text"}
			name={name}
			id={id}
			defaultValue={value}
			placeholder={placeholder}
			onChange={onChange}
		/>
	);
}
