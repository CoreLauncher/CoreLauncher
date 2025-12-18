import logoSVG from "@corelauncher/react/assets/logo.svg";
import "./LogoPattern.css";
import { dataToDataURL } from "@corelauncher/file-to-dataurl";
import clsx from "clsx";

const logoRequest = await fetch(logoSVG);
const logo = await logoRequest.text();

export default function LogoPattern({
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
			className={clsx("LogoPattern", className)}
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
