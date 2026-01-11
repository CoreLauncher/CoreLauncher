import "./App.css";
import { Style } from "@corelauncher/react";
import { Activity, useEffect, useRef, useState } from "react";
import {
	type CloseDialogRequestMessage,
	type Message,
	MessageType,
	type ShowDialogRequestMessage,
} from "../../types/messages";
import Socket from "../classes/Socket";
import Dialog from "../components/Atoms/Dialog/Dialog";
import Header from "../components/Sections/Header/Header";
import useDisableContextMenu from "../hooks/useDisableContextMenu";
import LibraryPage, {
	type LibraryPageRefObject,
} from "../pages/LibraryPage/LibraryPage";
import LoadingPage from "../pages/LoadingPage/LibraryPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";

export default function App() {
	const libraryRef = useRef<LibraryPageRefObject>(null);
	const [page, setPage] = useState("library");
	const [dialog, setDialog] = useState<ShowDialogRequestMessage | null>(null);
	useDisableContextMenu();

	useEffect(() => {
		function onMessage(type: MessageType, message: Message) {
			switch (type) {
				case MessageType.ShowDialogRequest: {
					const data = message as ShowDialogRequestMessage;
					setDialog(data);
					break;
				}
				case MessageType.CloseDialogRequest: {
					const data = message as CloseDialogRequestMessage;
					if (dialog?.id === data.id) setDialog(null);
					break;
				}
			}
		}

		const socket = Socket.instance;
		socket.on("message", onMessage);

		return () => {
			socket.off("message", onMessage);
		};
	}, [dialog]);

	function onSelect(tab: string) {
		if (page !== tab) {
			setPage(tab);
		} else if (tab === "library") {
			libraryRef.current?.clearSelection();
		}
	}

	return (
		<Style>
			<div className="App">
				<Header tab={page} onSelect={onSelect} />

				<Activity mode={page === "library" ? "visible" : "hidden"}>
					<LibraryPage ref={libraryRef} />
				</Activity>

				<Activity mode={page === "profile" ? "visible" : "hidden"}>
					<ProfilePage />
				</Activity>

				<Activity mode={page === "settings" ? "visible" : "hidden"}>
					<SettingsPage />
				</Activity>

				{dialog && <Dialog dialog={dialog} onClose={() => setDialog(null)} />}

				<LoadingPage />
			</div>
		</Style>
	);
}
