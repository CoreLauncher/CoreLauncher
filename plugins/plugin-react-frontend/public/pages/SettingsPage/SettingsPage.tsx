import "./SettingsPage.css";

export default function SettingsPage({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	if (!isVisible) return null;

	return <main className="SettingsPage"></main>;
}
