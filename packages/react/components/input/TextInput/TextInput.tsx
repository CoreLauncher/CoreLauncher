import clsx from "clsx";
import "./TextInput.css";
import { useId } from "react";
import { RequiredIndicator } from "../../other/RequiredIndicator/RequiredIndicator";

export function TextInput({
	className,
	isPassword = false,
	name = "",
	label,
	default: value = "",
	placeholder = "",
	required,
	disabled,
	onChange,
}: {
	className?: string;
	isPassword?: boolean;
	name?: string;
	label?: string;
	default?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	onChange?: (value: string) => void;
}) {
	const id = useId();

	return (
		<div className={clsx("cl-textinput", "cl-input-container", className)}>
			{label && (
				<label className="cl-input-label" htmlFor={id}>
					{label} <RequiredIndicator visible={required} />
				</label>
			)}
			<input
				className="cl-input"
				type={isPassword ? "password" : "text"}
				name={name}
				id={id}
				defaultValue={value}
				placeholder={placeholder}
				required={required}
				disabled={disabled}
				onChange={(event) => onChange?.(event.target.value)}
			/>
		</div>
	);
}
