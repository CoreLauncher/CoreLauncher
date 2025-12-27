import "./Header.css";
import { Logo } from "@corelauncher/react";
import clsx from "clsx";
import { MessageType } from "../../../../types/messages";
import Socket from "../../../classes/Socket";

export default function Header({
	tab,
	onSelect,
}: {
	tab: string;
	onSelect: (tab: string) => void;
}) {
	function onMouseDown(event: React.MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.nodeName !== "DIV") return;
		Socket.instance.send(MessageType.WindowInteraction, { type: "drag" });
	}

	function onMinimize() {
		Socket.instance.send(MessageType.WindowInteraction, { type: "minimize" });
	}

	function onMaximize() {
		Socket.instance.send(MessageType.WindowInteraction, { type: "maximize" });
	}

	function onClose() {
		Socket.instance.send(MessageType.WindowInteraction, { type: "close" });
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Shut your piehole
		<header className="Header" onMouseDown={onMouseDown}>
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

			<button type="button" className="window-controls" onClick={onMinimize}>
				‒
			</button>
			<button type="button" className="window-controls" onClick={onMaximize}>
				☐
			</button>
			<button type="button" className="window-controls close" onClick={onClose}>
				✕
			</button>
		</header>
	);
}
