import clsx from "clsx";
import "./Button.css";
import type { MouseEventHandler } from "react";

export function Button({
	onClick,
	className,
	children,
	type = "standard",
}: {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
	children?: React.ReactNode;
	type?: "standard" | "brand" | "success" | "warning" | "danger";
}) {
	const color = `--cl-color-button-${type}`;

	return (
		<button
			className={clsx("cl-button", "cl-input", className)}
			type="button"
			onClick={onClick}
			style={{
				["--cl-color-input" as string]: `var(${color})`,
				["--cl-color-input-hover" as string]: `var(${color}-hover)`,
			}}
		>
			{children}
		</button>
	);
}
