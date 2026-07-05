import "./branding-logo.css";

import clsx from "clsx";
import BrandingStamp from "../branding-stamp/branding-stamp";
import { BrandingSymbol } from "../branding-symbol/branding-symbol";

export default function BrandingLogo({
	className,
	size = 16,
}: {
	className?: string;
	size?: number | string;
}) {
	return (
		<div className={clsx("BrandingLogo", className)}>
			<BrandingSymbol
				size={`calc(${typeof size === "number" ? `${size}px` : size} * 1.5)`}
			/>
			<BrandingStamp size={size} />
		</div>
	);
}
