import {
	Button,
	CopyRight,
	Link,
	Logo,
	NumberInput,
	Style,
	Text,
	TextInput,
	TextMuted,
	WindowControls,
} from "@corelauncher/react";
import "./App.css";

export default function App() {
	const components = (
		<>
			<Button type="standard">This is a button</Button>
			<Button type="brand">This is a button</Button>
			<Button type="success">This is a button</Button>
			<Button type="warning">This is a button</Button>
			<Button type="danger">This is a button</Button>
			<CopyRight />
			<NumberInput />
			<NumberInput placeholder="placeholder" />
			<NumberInput default="1234567890" />
			<TextInput />
			<TextInput placeholder="placeholder" />
			<TextInput default="value" />
			<Logo />
			{/*Text*/}
			<Link url={"https://example.com"}>This is a link</Link>
			<Text>
				This is normal text <Link url={"https://example.com"}>with a link</Link>
			</Text>
			<Text>This is normal text</Text>
			<TextMuted>This is muted text</TextMuted>
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
