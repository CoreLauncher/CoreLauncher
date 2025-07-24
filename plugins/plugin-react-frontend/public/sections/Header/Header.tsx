import { GearFill } from "react-bootstrap-icons";

import "./Header.css";
import { Logo } from "@corelauncher/react";

export default function Header({
	selectedTab,
	onClickHome = () => {},
	onClickSettings = () => {},
}: {
	selectedTab?: string;
	onClickHome?: () => void;
	onClickSettings?: () => void;
}) {
	return (
		<header className="Header">
			<div className="start">
				<button type="button" className="logo" onClick={onClickHome}>
					<Logo size={"100%"} />
					<p>CORELAUNCHER</p>
				</button>
			</div>
			<div className="end">
				<button
					type="button"
					className={`tab ${selectedTab === "settings" ? "selected" : ""}`}
					onClick={onClickSettings}
				>
					<GearFill color="var(--tab-text-color)" />
					Settings
				</button>
			</div>
		</header>
	);
}
