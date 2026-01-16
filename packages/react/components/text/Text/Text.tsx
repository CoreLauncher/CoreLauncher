import type { ReactNode } from "react";
import "./Text.css";

export function Text({ children }: { children: ReactNode }) {
	return <p className="cl-text">{children}</p>;
}
