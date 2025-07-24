import { Button, Input, Logo, Style, TextMuted } from "@corelauncher/react";
import { renderSVG } from "uqr";
import "./App.css";
import { useEffect, useState } from "react";
import { Hourglass, LockFill, Steam, X } from "react-bootstrap-icons";

export default function App() {
	const [qr, setQR] = useState<string | null>(null);
	const [state, setState] = useState<string>("initial");

	useEffect(() => {
		const socket = new WebSocket("/events");

		socket.addEventListener("message", (event) => {
			const message = JSON.parse(event.data);
			const { type, data } = message;
			console.log(message);

			switch (type) {
				case "qr-change": {
					setQR(data.qr);
					setState(data.state);
					break;
				}

				case "qr-interaction": {
					setState("interaction");
					break;
				}

				default:
					break;
			}
		});

		return () => {
			socket.close();
		};
	}, []);

	return (
		<div className="App">
			<Style>
				<div className="header">
					<div className="logo-container">
						<Logo size={32} />
						<X size={20} />
						<Steam size={32} />
					</div>
					<h3>Connect Steam to CoreLauncher</h3>
					<LockFill className="lock" />
				</div>
				<div className="body">
					<div className="password-login">
						<Input name="username" placeholder="Username" type="text" />
						<Input name="password" placeholder="Password" type="password" />
						<Button>Login</Button>
					</div>
					<div className="qr-login">
						<div
							className={`qr-code ${state !== "active" ? "invalid-qr" : ""}`}
						>
							<div
								className="qr-code-svg"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: <this is the way>
								dangerouslySetInnerHTML={{
									__html: qr
										? renderSVG(qr, { border: 0 })
										: renderSVG("You should not be able to scan this QR", {
												border: 0,
											}),
								}}
							/>
							<div className="qr-code-state">
								<Hourglass size={"50%"} />
							</div>
						</div>
					</div>
				</div>
				<TextMuted>
					All credientials are sent to the Steam servers directly, we do not
					store or process them in any way.
				</TextMuted>
			</Style>
		</div>
	);
}
