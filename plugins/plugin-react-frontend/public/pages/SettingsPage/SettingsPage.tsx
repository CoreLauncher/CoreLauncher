import { useState } from "react";
import "./SettingsPage.css";
import { DiamondFill } from "react-bootstrap-icons";
import TabList from "./subcompontents/TabList/TabList";
import GeneralTab from "./tabs/GeneralTab/GeneralTab";

export default function SettingsPage({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const [selected, setSelected] = useState("general");

	if (!isVisible) return null;

	return (
		<main className="SettingsPage">
			<TabList
				selected={selected}
				tabs={[
					{
						title: "General",
						value: "general",
						icon: DiamondFill,
					},
				]}
			/>
			<GeneralTab isVisible={selected === "general"} />
		</main>
	);
}
