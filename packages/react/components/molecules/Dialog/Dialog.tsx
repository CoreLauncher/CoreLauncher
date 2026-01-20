import clsx from "clsx";
import { Block } from "../../atoms/Block/Block";
import "./Dialog.css";
import type { MouseEvent, ReactNode } from "react";
import type { Icon } from "react-bootstrap-icons";
import { createPortal } from "react-dom";
import { WindowControls } from "../WindowControls/WindowControls";

export function Dialog({
	className,
	children,
	title = "",
	hasHeader = true,
	hasOverflow = true,
	width = 800,
	height = 400,
	icon,
	onClose = () => {},
}: {
	className?: string;
	children?: ReactNode;
	title?: string;
	hasHeader?: boolean;
	hasOverflow?: boolean;
	width?: number;
	height?: number;
	icon?: Icon;
	onClose?: () => void;
}) {
	const IconComponent = icon;

	function onClick(event: MouseEvent) {
		if (event.target === event.currentTarget) onClose();
	}

	return createPortal(
		// biome-ignore lint/a11y/useKeyWithClickEvents: We also have a close button
		// biome-ignore lint/a11y/noStaticElementInteractions: We also have a close button
		<div className={clsx("cl-dialog", className)} onClick={onClick}>
			<Block
				className="content"
				style={{
					["--cl-dialog-width" as string]: `${width}px`,
					["--cl-dialog-height" as string]: `${height}px`,
				}}
			>
				{hasHeader && (
					<div className="header">
						<div className="header-content">
							{IconComponent ? (
								<IconComponent
									className="icon
								"
									size={20}
								/>
							) : null}
							<p className="title">{title}</p>
						</div>
						<WindowControls
							className="windowcontrols"
							hasMinimize={false}
							hasMaximize={false}
							hasClose={true}
							onClose={onClose}
						/>
					</div>
				)}
				<div
					className="body"
					style={{
						overflow: hasOverflow ? "auto" : "hidden",
					}}
				>
					{children}
				</div>
			</Block>
		</div>,
		document.getElementById("root")!,
	);
}
