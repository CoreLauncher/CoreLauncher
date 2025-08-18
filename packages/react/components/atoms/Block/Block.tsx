import "./Block.css";

export function Block({
	children,
	className = "",
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return <div className={`cl-block ${className}`}>{children}</div>;
}
