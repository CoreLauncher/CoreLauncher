import { Button, Input, Style } from "@corelauncher/react";
import "./App.css";

export default function App() {
	return (
		<div className="App">
			<Style>
				<Input name="username" placeholder="Username" type="text" />
				<Input name="password" placeholder="Password" type="password" />
				<Button>Login</Button>
			</Style>
		</div>
	);
}
