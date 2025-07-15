import "./Button.css";

export function Button({
	children,
	onClick,
}: {
	children?: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<button className="cl-button" type="button" onClick={onClick}>
			{children}
		</button>
	);
}
