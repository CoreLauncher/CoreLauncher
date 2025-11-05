import useApplicationVersion from "../../../../hooks/useApplicationVersion";
import "./GeneralTab.css";

export default function GeneralTab({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const version = useApplicationVersion();
	if (!isVisible) return null;

	return (
		<div className="GeneralTab">
			<div>
				<p>CoreLauncher Version: {version.version}</p>
			</div>
		</div>
	);
}
