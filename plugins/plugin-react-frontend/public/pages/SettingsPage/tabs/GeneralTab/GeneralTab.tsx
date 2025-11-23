import { useApplicationStore } from "../../../../stores/ApplicationStore";
import "./GeneralTab.css";

export default function GeneralTab({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const version = useApplicationStore((state) => state.version);
	if (!isVisible) return null;

	return (
		<div className="GeneralTab">
			<div>
				<p>CoreLauncher Version: {version}</p>
			</div>
		</div>
	);
}
