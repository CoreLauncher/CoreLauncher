import { CloudArrowDownFill } from "react-bootstrap-icons";

import logoSVG from "../../assets/logo.svg";
import "./Header.css";

export default function Header() {
	return (
		<header className="Header">
			<div className="start">
				<button type="button" className="logo">
					<img src={logoSVG} alt="logo" />
					<p>CORELAUNCHER</p>
				</button>
			</div>
			<div className="end">
				<button type="button">
					<CloudArrowDownFill />
				</button>
			</div>
		</header>
	);
}
