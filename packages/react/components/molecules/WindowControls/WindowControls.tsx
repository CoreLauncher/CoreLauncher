import clsx from "clsx";
import "./WindowControls.css";
import { Activity, type MouseEventHandler } from "react";
import { Button } from "../../atoms/Button/Button";

export function WindowControls({
	className,
	hasMinimize = true,
	hasMaximize = true,
	hasClose = true,
	onMinimize = () => {},
	onMaximize = () => {},
	onClose = () => {},
}: {
	className?: string;
	hasClose?: boolean;
	hasMinimize?: boolean;
	hasMaximize?: boolean;
	onClose?: MouseEventHandler<HTMLButtonElement>;
	onMinimize?: MouseEventHandler<HTMLButtonElement>;
	onMaximize?: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<div className={clsx("cl-windowcontrols", className)}>
			<Activity mode={hasMinimize ? "visible" : "hidden"}>
				<Button
					className="button minimize"
					onClick={onMinimize}
					hoverColor="var(--cl-color-accent)"
				>
					‒
				</Button>
			</Activity>
			<Activity mode={hasMaximize ? "visible" : "hidden"}>
				<Button
					className="button maximize"
					onClick={onMaximize}
					hoverColor="var(--cl-color-accent)"
				>
					☐
				</Button>
			</Activity>
			<Activity mode={hasClose ? "visible" : "hidden"}>
				<Button
					className="button close"
					onClick={onClose}
					hoverColor="var(--cl-color-error)"
				>
					✕
				</Button>
			</Activity>
		</div>
	);
}
