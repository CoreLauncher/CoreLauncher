import BrandingLogo from "../../branding/branding-logo/branding-logo";
import "./header.css";

export default function Header() {
	function onMouseDown(event: React.MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.nodeName !== "DIV" && target.nodeName !== "HEADER") return;
		window.ipc.postMessage(
			JSON.stringify({
				type: "window_drag",
			}),
		);
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Shut your piehole
		<header className="Header" onMouseDown={onMouseDown}>
			<BrandingLogo size={20} />
			<p>Header</p>
		</header>
	);
}
