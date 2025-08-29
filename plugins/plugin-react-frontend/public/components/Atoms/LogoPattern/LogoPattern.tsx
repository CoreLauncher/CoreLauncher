import { useEffect, useRef, useState } from "react";
import "./LogoPattern.css";
import clsx from "clsx";

export default function LogoPattern({
	className = "",
	rotation = 15,
	brightness = 30,
	size = 150,
	gap = 30,
}: {
	className?: string;
	rotation?: number;
	brightness?: number;
	size?: number;
	gap?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [containerSize, setContainerSize] = useState(0);

	useEffect(() => {
		if (!ref.current) return () => {};

		function onResize() {
			const width = ref.current?.clientWidth || 0;
			const height = ref.current?.clientHeight || 0;
			setContainerSize(Math.max(width, height) * 2);
		}

		const observer = new ResizeObserver(onResize);
		observer.observe(ref.current);
		return () => observer.disconnect();
	});

	return (
		<div
			className={clsx("LogoPattern", className)}
			ref={ref}
			style={
				{
					"--rotation": `${rotation}deg`,
					"--brightness": `${brightness}%`,
					"--size": `${size}px`,
					"--gap": `${gap}px`,
					"--container-size": `${containerSize}px`,
				} as React.CSSProperties
			}
		/>
	);
}
