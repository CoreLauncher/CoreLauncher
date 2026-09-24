import clsx from "clsx";
import "./symbol-pattern.css";
import logoSVG from "../../../../../../assets/logos/logo.svg";

const logoRequest = await fetch(logoSVG);
const logo = await logoRequest.text();

function dataToDataURL(data: string, type: string) {
	return `data:${type};base64,${btoa(data)}`;
}

export default function SymbolPattern({
	className = "",
	rotation = 15,
	brightness = 30,
	size = 150,
	gap = 10,
}: {
	className?: string;
	rotation?: number;
	brightness?: number;
	size?: number;
	gap?: number;
}) {
	return (
		<div
			className={clsx("SymbolPattern", className)}
			style={
				{
					"--image": `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size + gap}" height="${size + gap}"><image width="${size}" height="${size}" xlink:href="${dataToDataURL(logo, "image/svg+xml")}" /></svg>')`,
					"--rotation": `${rotation}deg`,
					"--brightness": `${brightness}%`,
				} as React.CSSProperties
			}
		/>
	);
}
