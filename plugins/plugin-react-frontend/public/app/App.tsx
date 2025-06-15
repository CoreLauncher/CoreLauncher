import { useEffect } from "react";
import "../index.css";
import "./App.css";
import Header from "../sections/Header/Header";

export function App() {
	// Prevent right-click context menu from appearing
	useEffect(() => {
		function onContextMenu(event: MouseEvent) {
			event.preventDefault();
		}

		document.addEventListener("contextmenu", onContextMenu);
		return () => {
			document.removeEventListener("contextmenu", onContextMenu);
		};
	}, []);

	return (
		<div className="App">
			<Header />
		</div>
	);
}

export default App;
