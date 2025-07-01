import { GearFill } from "react-bootstrap-icons";

import logoSVG from "../../assets/logo.svg";
import "./Header.css";

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
					<img src={logoSVG} alt="logo" />
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
