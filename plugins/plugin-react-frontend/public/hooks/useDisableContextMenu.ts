import { useEffect } from "react";
import { MessageType } from "../../types/messages";
import Socket from "../classes/Socket";
import { useApplicationStore } from "../stores/ApplicationStore";

export default function useDisableContextMenu() {
	const environment = useApplicationStore((store) => store.environment);

	useEffect(() => {
		function onContextMenu(event: MouseEvent) {
			if (environment === "development") return;
			event.preventDefault();
		}

		document.addEventListener("contextmenu", onContextMenu);
		return () => {
			document.removeEventListener("contextmenu", onContextMenu);
		};
	}, [environment]);

	useEffect(() => {
		if (environment !== "production") return;

		function onKeyDown(event: KeyboardEvent) {
			if (
				event.key !== "F12" &&
				!(event.ctrlKey && event.shiftKey && event.key === "I")
			)
				return;

			Socket.instance.send(MessageType.OpenExternalLink, {
				url: "https://youtu.be/jy4qYmf3TxA",
			});
		}

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [environment]);
}
