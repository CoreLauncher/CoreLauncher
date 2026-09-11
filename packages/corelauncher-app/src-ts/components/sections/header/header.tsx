import clsx from "clsx";
import BrandingLogo from "../../branding/branding-logo/branding-logo";
import "./header.css";
import useCoreLauncher from "../../../hooks/use-corelauncher";

export default function Header({
	activeTab,
	onTabChange,
}: {
	activeTab: string;
	onTabChange: (tab: string) => void;
}) {
	const corelauncher = useCoreLauncher();

	function onMouseDown(event: React.MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.nodeName !== "DIV" && target.nodeName !== "HEADER") return;
		corelauncher.startWindowDrag();
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
