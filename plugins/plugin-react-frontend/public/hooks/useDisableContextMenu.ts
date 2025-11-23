import { useEffect } from "react";
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
}
