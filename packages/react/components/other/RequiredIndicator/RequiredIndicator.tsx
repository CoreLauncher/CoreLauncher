import "./RequiredIndicator.css";

export function RequiredIndicator({ visible }: { visible?: boolean }) {
	if (!visible) return null;
	return <p className="cl-required-indicator">*</p>;
}
