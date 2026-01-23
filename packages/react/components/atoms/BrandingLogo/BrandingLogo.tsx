import "./BrandingLogo.css";
import clsx from "clsx";
import { BrandingSymbol } from "../BrandingSymbol/BrandingSymbol";

export function BrandingLogo({
	className = "",
	size = 16,
}: {
	className?: string;
	size?: number | string;
}) {
	return (
		<div
			className={clsx("cl-brandinglogo", className)}
			style={{
				["--size" as string]: typeof size === "number" ? `${size}px` : size,
			}}
		>
			<BrandingSymbol size={size} />
			<p>CORELAUNCHER</p>
		</div>
	);
}
