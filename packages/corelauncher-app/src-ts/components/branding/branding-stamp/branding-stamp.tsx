import clsx from "clsx";
import "./branding-stamp.css";

export default function BrandingStamp({
	className,
	size = 16,
}: {
	className?: string;
	size?: number | string;
}) {
	return (
		<p className={clsx("BrandingStamp", className)} style={{ fontSize: size }}>
			CORELAUNCHER
		</p>
	);
}
