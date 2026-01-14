import { Block, Style } from "@corelauncher/react";
import "./App.css";

export default function App() {
	return (
		<Style>
			<div className="App">
				<Block className="block">
					<h1>Authentication complete!</h1>
					<p>You can now close this tab and return to CoreLauncher</p>
				</Block>
			</div>
		</Style>
	);
}
