import "./App.css";
import { Style } from "@corelauncher/react";
import { useState } from "react";
import LibraryPage from "../components/Pages/LibraryPage/LibraryPage";
import SettingsPage from "../components/Pages/SettingsPage/SettingsPage";
import Header from "../components/Sections/Header/Header";
import useDisableContextMenu from "../hooks/useDisableContextMenu";

export default function App() {
	const [page, setPage] = useState("library");
	useDisableContextMenu();

	return (
		<Style>
			<div className="App">
				<Header
					selectedTab={page}
					onClickHome={() => setPage("library")}
					onClickSettings={() => setPage("settings")}
				/>
				<LibraryPage isVisible={page === "library"} />
				<SettingsPage isVisible={page === "settings"} />
			</div>
		</Style>
	);
}
