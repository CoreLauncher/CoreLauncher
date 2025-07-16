import "./Input.css";

export function Input({
	id,
	name,
	type = "text",
	placeholder = "",
	onChange,
}: {
	id?: string;
	name?: string;
	type?: "text" | "password";
	placeholder?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<input
			className="cl-input"
			id={id}
			name={name}
			type={type}
			placeholder={placeholder}
			onChange={onChange}
			autoComplete="off"
		/>
	);
}
