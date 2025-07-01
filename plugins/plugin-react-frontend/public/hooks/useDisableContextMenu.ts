import { useEffect } from "react";

export default function useDisableContextMenu() {
	useEffect(() => {
		function onContextMenu(event: MouseEvent) {
			event.preventDefault();
		}

		document.addEventListener("contextmenu", onContextMenu);
		return () => {
			document.removeEventListener("contextmenu", onContextMenu);
		};
	}, []);
}
