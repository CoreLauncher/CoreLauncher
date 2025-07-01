import "../index.css";
import "./App.css";
import useDisableContextMenu from "../hooks/useDisableContextMenu";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import Header from "../sections/Header/Header";

export default function App() {
	useDisableContextMenu();

	return (
		<div className="App">
			<Header />
			<LibraryPage />
		</div>
	);
}
