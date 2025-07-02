import type { Icon } from "react-bootstrap-icons";
import "./TabList.css";

type Tab = {
	title: string;
	icon: Icon;
	value: string;
};

export default function TabList({
	tabs = [],
	onSelect = () => {},
	selected,
}: {
	tabs?: Tab[];
	onSelect?: (tab: string) => void;
	selected?: string;
}) {
	return (
		<div className="TabList">
			{tabs.map((tab) => (
				<button
					key={tab.value}
					type="button"
					className={`tab ${selected === tab.value ? "selected" : ""}`}
					onClick={() => onSelect(tab.value)}
				>
					<div>
						<tab.icon size={"100%"} />
					</div>
					<span>{tab.title}</span>
				</button>
			))}
		</div>
	);
}
