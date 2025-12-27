import "./App.css";
import { Style } from "@corelauncher/react";
import { Activity, useRef, useState } from "react";
import Header from "../components/Sections/Header/Header";
import useDisableContextMenu from "../hooks/useDisableContextMenu";
import LibraryPage, {
	type LibraryPageRefObject,
} from "../pages/LibraryPage/LibraryPage";
import LoadingPage from "../pages/LoadingPage/LibraryPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";

export default function App() {
	const libraryRef = useRef<LibraryPageRefObject>(null);
	const [page, setPage] = useState("library");
	useDisableContextMenu();

	function onSelect(tab: string) {
		if (page !== tab) {
			setPage(tab);
		} else if (tab === "library") {
			libraryRef.current?.clearSelection();
		}
	}

	return (
		<Style>
			<div className="App">
				<Header tab={page} onSelect={onSelect} />

				<Activity mode={page === "library" ? "visible" : "hidden"}>
					<LibraryPage ref={libraryRef} />
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
