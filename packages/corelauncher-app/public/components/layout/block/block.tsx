import "./block.css";

import clsx from "clsx";
import type { ReactNode } from "react";

export default function Block({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	return <div className={clsx("Block", className)}>{children}</div>;
}
