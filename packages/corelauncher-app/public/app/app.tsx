import { useState } from "react";
import Header from "../components/sections/header/header";
import LibraryPage from "../pages/library-page/library-page";
import "./app.css";
import SettingsPage from "../pages/settings-page/settings-page";

export default function App() {
	const [page, setPage] = useState("library");

	return (
		<div className="App">
			<Header activeTab={page} onTabChange={setPage} />
			<main>
				{page === "library" && <LibraryPage />}
				{page === "settings" && <SettingsPage />}
			</main>
		</div>
	);
}
