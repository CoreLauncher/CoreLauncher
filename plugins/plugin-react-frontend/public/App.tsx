import { useEffect } from "react";
import "./index.css";

export function App() {
	useEffect(() => {
		function onContextMenu(event: MouseEvent) {
			event.preventDefault();
		}

		document.addEventListener("contextmenu", onContextMenu);
		return () => {
			document.removeEventListener("contextmenu", onContextMenu);
		};
	}, []);

	return <div className="App">Hi</div>;
}

export default App;
