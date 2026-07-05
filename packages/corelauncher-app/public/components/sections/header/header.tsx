import clsx from "clsx";
import BrandingLogo from "../../branding/branding-logo/branding-logo";
import "./header.css";

export default function Header({
    activeTab,
	onTabChange,
}: {
    activeTab: string;
	onTabChange: (tab: string) => void;
}) {
	function onMouseDown(event: React.MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.nodeName !== "DIV" && target.nodeName !== "HEADER") return;
		window.ipc.postMessage(
			JSON.stringify({
				type: "window_drag",
			}),
		);
	}

	const tabs = [
		{
			id: "library",
			label: "Library",
		},
		{
			id: "settings",
			label: "Settings",
		},
	];

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Shut your piehole
		<header className="Header" onMouseDown={onMouseDown}>
			<BrandingLogo size={20} />
			<div className="tabs">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						className={clsx("tab", { active: tab.id === activeTab })}
						onClick={() => onTabChange(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<p>Header</p>
		</header>
	);
}
