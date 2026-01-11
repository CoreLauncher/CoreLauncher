import "./Dialog.css";
import type { ShowDialogOptions } from "@corelauncher/types";

export default function Dialog({
	dialog,
	onClose,
}: {
	dialog: ShowDialogOptions;
	onClose: () => void;
}) {
	function onClick() {
		onClose();
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Well yes
		// biome-ignore lint/a11y/useKeyWithClickEvents: Well yes
		<div className={"Dialog"} onClick={onClick}>
			<iframe
				src={dialog.url}
				title="dialog"
				width={dialog.width}
				height={dialog.height}
			/>
		</div>
	);
}
