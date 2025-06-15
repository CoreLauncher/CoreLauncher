import { CloudArrowDownFill } from "react-bootstrap-icons";

import logoSVG from "../../assets/logo.svg";
import "./Header.css";

export function Header() {
	return (
		<header className="Header">
			<div className="start">
				<div className="logo">
					<img src={logoSVG} alt="logo" />
					<p>CORELAUNCHER</p>
				</div>
			</div>
			<div className="end">
				<button type="button">
					<CloudArrowDownFill />
				</button>
			</div>
		</header>
	);
}

export default Header;
