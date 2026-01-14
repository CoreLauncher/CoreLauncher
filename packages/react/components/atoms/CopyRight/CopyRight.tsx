import "./CopyRight.css";

export function CopyRight({ className = "" }: { className?: string }) {
	return (
		<p
			className={`cl-copyright ${className}`}
			style={{
				color: "var(--cl-color-text-muted)",
			}}
		>
			Copyright © {new Date().getFullYear()} CoreByte & Contributors.
		</p>
	);
}
