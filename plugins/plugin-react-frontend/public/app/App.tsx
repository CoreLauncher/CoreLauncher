import "./App.css";
import { Style } from "@corelauncher/react";
import { useState } from "react";
import Header from "../components/Sections/Header/Header";
import useDisableContextMenu from "../hooks/useDisableContextMenu";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import LoadingPage from "../pages/LoadingPage/LibraryPage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";

export default function App() {
	const [page, setPage] = useState("library");
	useDisableContextMenu();

	return (
		<Style>
			<div className="App">
				<Header tab={page} onSelect={(tab) => setPage(tab)} />
				<LibraryPage isVisible={page === "library"} />
				<SettingsPage isVisible={page === "settings"} />
				<LoadingPage />
			</div>
		</Style>
	);
}
