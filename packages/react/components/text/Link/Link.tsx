import type { ReactNode } from "react";
import "./Link.css";

export function Link({ children, url }: { children: ReactNode; url: string }) {
	return (
		<a href={url} className="cl-link">
			{children}
		</a>
	);
}
