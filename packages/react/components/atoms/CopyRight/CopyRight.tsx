import { TextMuted } from "../../text/TextMuted/TextMuted";
import "./CopyRight.css";

export function CopyRight({ className = "" }: { className?: string }) {
	return (
		<TextMuted className={`cl-copyright ${className}`}>
			Copyright © {new Date().getFullYear()} CoreByte & Contributors.
		</TextMuted>
	);
}
