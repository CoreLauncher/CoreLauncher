import "./Input.css";

export function Input({
	id,
	name,
	type = "text",
	placeholder = "",
}: {
	id?: string;
	name?: string;
	type?: "text" | "password";
	placeholder?: string;
}) {
	return (
		<input
			className="cl-input"
			id={id}
			name={name}
			type={type}
			placeholder={placeholder}
		/>
	);
}
