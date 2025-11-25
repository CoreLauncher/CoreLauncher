import "./Header.css";
import { Logo } from "@corelauncher/react";
import clsx from "clsx";

export default function Header({
	tab,
	onSelect,
}: {
	tab: string;
	onSelect: (tab: string) => void;
}) {
	return (
		<header className="Header">
			<div className="logo">
				<Logo size={"2.3em"} />
				<p>CORELAUNCHER</p>
			</div>

			<div />

			<button
				type="button"
				className={clsx("tab", { selected: tab === "library" })}
				onClick={() => onSelect("library")}
			>
				Library
			</button>

			<button
				type="button"
				className={clsx("tab", { selected: tab === "profile" })}
				onClick={() => onSelect("profile")}
			>
				Profile
			</button>

			<button
				type="button"
				className={clsx("tab", { selected: tab === "settings" })}
				onClick={() => onSelect("settings")}
			>
				Settings
			</button>

			<div className="spacer" />

			<button type="button" className="window-controls">
				—
			</button>
			<button type="button" className="window-controls">
				☐
			</button>
			<button type="button" className="window-controls">
				✕
			</button>
		</header>
	);
}
