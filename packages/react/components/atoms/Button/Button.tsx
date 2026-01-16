import clsx from "clsx";
import "./Button.css";
import type { MouseEventHandler } from "react";

export function Button({
	onClick,
	className,
	children,
	color = "var(--cl-color-input)",
	hoverColor = "var(--cl-color-input-hover)",
}: {
	onClick?: MouseEventHandler<HTMLButtonElement>;
	className?: string;
	children?: React.ReactNode;
	color?: string;
	hoverColor?: string;
}) {
	return (
		<button
			className={clsx("cl-button", className)}
			type="button"
			onClick={onClick}
			style={{
				["--cl-button-color" as string]: color,
				["--cl-button-hover-color" as string]: hoverColor,
			}}
		>
			{children}
		</button>
	);
}
