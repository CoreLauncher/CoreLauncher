import CoreLauncher from "../classes/corelauncher";

const RESIZE_HANDLE_SIZE = 5;

type ResizePosition =
	| "top"
	| "bottom"
	| "left"
	| "right"
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

function hitTest(
	mouseX: number,
	mouseY: number,
	windowWidth: number,
	windowHeight: number,
): null | ResizePosition {
	const atTop = mouseY < RESIZE_HANDLE_SIZE;
	const atBottom = mouseY > windowHeight - RESIZE_HANDLE_SIZE;
	const atLeft = mouseX < RESIZE_HANDLE_SIZE;
	const atRight = mouseX > windowWidth - RESIZE_HANDLE_SIZE;

	if (atTop && atLeft) return "top-left";
	if (atTop && atRight) return "top-right";
	if (atBottom && atLeft) return "bottom-left";
	if (atBottom && atRight) return "bottom-right";
	if (atTop) return "top";
	if (atBottom) return "bottom";
	if (atLeft) return "left";
	if (atRight) return "right";

	return null;
}

function getCursor(position: ResizePosition) {
	switch (position) {
		case "top":
		case "bottom":
			return "ns-resize";
		case "left":
		case "right":
			return "ew-resize";
		case "top-left":
		case "bottom-right":
			return "nwse-resize";
		case "top-right":
		case "bottom-left":
			return "nesw-resize";
	}
}

export default function enableWindowResize() {
	const corelauncher = CoreLauncher.instance;

	window.addEventListener("mousemove", (event) => {
		const position = hitTest(
			event.clientX,
			event.clientY,
			window.innerWidth,
			window.innerHeight,
		);
		if (position) {
			document.body.style.cursor = getCursor(position);
		} else {
			document.body.style.cursor = "default";
		}
	});

	window.addEventListener("mousedown", (event) => {
		const position = hitTest(
			event.clientX,
			event.clientY,
			window.innerWidth,
			window.innerHeight,
		);
		if (position) {
			corelauncher.startWindowResize(position);
		}
	});
}
