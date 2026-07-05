import Header from "../components/sections/header/header";
import LibraryPage from "../pages/library-page/library-page";
import "./app.css";

export default function App() {
	return (
		<div className="App">
			<Header />
			<main>
				<LibraryPage />
			</main>
		</div>
	);
}
