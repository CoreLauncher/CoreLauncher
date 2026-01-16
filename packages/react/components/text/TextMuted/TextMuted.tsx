import type { ReactNode } from "react";
import "./TextMuted.css";
import clsx from "clsx";

export function TextMuted({
	className,
	children,
}: {
	className?: string;
	children: ReactNode;
}) {
	return <p className={clsx("cl-text-muted", className)}>{children}</p>;
}
