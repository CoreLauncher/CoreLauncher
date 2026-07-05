import BrandingLogo from "../../branding/branding-logo/branding-logo";
import "./header.css";

export default function Header() {
	return (
		<header className="Header">
			<BrandingLogo size={20} />
			<p>Header</p>
		</header>
	);
}
