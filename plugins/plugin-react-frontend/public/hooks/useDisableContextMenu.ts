import { useEffect } from "react";
import useApplicationVersion from "./useApplicationVersion";

export default function useDisableContextMenu() {
	const version = useApplicationVersion();

	useEffect(() => {
		function onContextMenu(event: MouseEvent) {
			if (version.environment === "development") return;
			event.preventDefault();
		}

		document.addEventListener("contextmenu", onContextMenu);
		return () => {
			document.removeEventListener("contextmenu", onContextMenu);
		};
	}, [version]);
}
