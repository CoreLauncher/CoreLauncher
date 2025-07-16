import "./App.css";
import { Style } from "@corelauncher/react";
import { useState } from "react";
import useDisableContextMenu from "../hooks/useDisableContextMenu";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import Header from "../sections/Header/Header";

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
