import {
	Button,
	CopyRight,
	Input,
	Logo,
	Style,
	TextMuted,
	WindowControls,
} from "@corelauncher/react";
import "./App.css";

export default function App() {
	const components = (
		<>
			<Button>This is a button</Button>
			<CopyRight />
			<Input />
			<Logo />
			<TextMuted>This is text</TextMuted>
			{/* Molecules*/}
			<WindowControls />
		</>
	);

	return (
		<Style>
			<div className="App">
				<div className="block">{components}</div>
				<div className="normal">{components}</div>
			</div>
		</Style>
	);
}
