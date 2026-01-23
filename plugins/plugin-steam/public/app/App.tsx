import { BrandingSymbol, Style, TextMuted } from "@corelauncher/react";
import "./App.css";
import { useEffect, useState } from "react";
import { LockFill, Steam, X } from "react-bootstrap-icons";
import QRCode, { QRCodeState } from "../components/atoms/QRCode/QRCode";

export default function App() {
	const [qrValue, setQrValue] = useState<string>("");
	const [qrState, setQrState] = useState<QRCodeState>(QRCodeState.Loading);

	useEffect(() => {
		const socket = new WebSocket("/events");

		socket.addEventListener("message", (event) => {
			const message = JSON.parse(event.data);
			const { type, data } = message;

			switch (type) {
				case "qr-change": {
					setQrValue(data.qr);
					setQrState(
						data.state === "active" ? QRCodeState.Normal : QRCodeState.Waiting,
					);
					break;
				}

				case "qr-interaction": {
					setQrState(QRCodeState.Waiting);
					break;
				}
			}
		});

		return () => {
			socket.close();
		};
	}, []);

	return (
		<Style hasTransparentBackground={true}>
			<div className="App">
				<div className="header">
					<div className="logo-container">
						<BrandingSymbol size={32} />
						<X size={20} />
						<Steam size={32} />
					</div>
					<h3>Connect Steam to CoreLauncher</h3>
					<LockFill className="lock" />
				</div>
				<div className="body">
					<QRCode className="qrcode" state={qrState} value={qrValue} />
					<div className="info">
						<p>
							Log in to your Steam account by scanning the QR code with the
							Steam Mobile App.
						</p>
						<TextMuted>
							All login credentials are only sent to the Steam servers directly,
							we do not store or process them in any way outside of your
							computer.
						</TextMuted>
					</div>
				</div>
			</div>
		</Style>
	);
}
