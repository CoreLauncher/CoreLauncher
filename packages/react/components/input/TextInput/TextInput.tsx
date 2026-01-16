import clsx from "clsx";
import "./TextInput.css";
import type { ChangeEventHandler } from "react";

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
	return (
		<input
			className={clsx("cl-textinput", "cl-input", className)}
			type={isPassword ? "password" : "text"}
			name={name}
			defaultValue={value}
			placeholder={placeholder}
			onChange={onChange}
		/>
	);
}
