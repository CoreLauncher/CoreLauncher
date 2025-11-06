import "./Block.css";

export function Block({
	children,
	className = "",
	style,
}: {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<div className={`cl-block ${className}`} style={style}>
			{children}
		</div>
	);
}
