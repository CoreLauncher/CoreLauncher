import "./block.css";

import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

export default function Block({
	className,
	style,
	children,
}: {
	className?: string;
	style?: CSSProperties;
	children?: ReactNode;
}) {
	return (
		<div className={clsx("Block", className)} style={style}>
			{children}
		</div>
	);
}
