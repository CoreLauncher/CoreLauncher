import clsx from "clsx";
import "./Button.css";

export function Button({
	onClick,
	className,
	children,
}: {
	onClick?: () => void;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<button
			className={clsx("cl-button", className)}
			type="button"
			onClick={onClick}
		>
			{children}
		</button>
	);
}
