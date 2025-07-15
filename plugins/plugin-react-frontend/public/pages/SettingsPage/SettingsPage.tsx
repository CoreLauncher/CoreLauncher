import { useState } from "react";
import "./SettingsPage.css";
import { DiamondFill, PersonFill } from "react-bootstrap-icons";
import TabList from "./subcompontents/TabList/TabList";
import AccountsTab from "./tabs/AccountsTab/AccountsTab";
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
				onSelect={(tab) => setSelected(tab)}
				selected={selected}
				tabs={[
					{
						title: "General",
						value: "general",
						icon: DiamondFill,
					},
					{
						title: "Accounts",
						value: "accounts",
						icon: PersonFill,
					},
				]}
			/>
			<AccountsTab isVisible={selected === "accounts"} />
			<GeneralTab isVisible={selected === "general"} />
		</main>
	);
}
