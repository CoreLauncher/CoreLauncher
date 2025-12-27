import "./App.css";
import { Style } from "@corelauncher/react";
import { Activity, useState } from "react";
import Header from "../components/Sections/Header/Header";
import useDisableContextMenu from "../hooks/useDisableContextMenu";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import LoadingPage from "../pages/LoadingPage/LibraryPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";

export default function App() {
	const [page, setPage] = useState("library");
	useDisableContextMenu();

	return (
		<Style>
			<div className="App">
				<Header tab={page} onSelect={(tab) => setPage(tab)} />

				<Activity mode={page === "library" ? "visible" : "hidden"}>
					<LibraryPage />
				</Activity>

				<Activity mode={page === "profile" ? "visible" : "hidden"}>
					<ProfilePage />
				</Activity>

				<Activity mode={page === "settings" ? "visible" : "hidden"}>
					<SettingsPage />
				</Activity>

				<LoadingPage />
			</div>
		</Style>
	);
}
