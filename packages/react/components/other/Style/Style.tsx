import "../../../style/index.css";

/**
 * This component loads all the styles used by CoreLauncher.
 */
export function Style({
	children,
	hasTransparentBackground = false,
}: {
	children?: React.ReactNode;
	hasTransparentBackground?: boolean;
}) {
	return (
		<>
			{hasTransparentBackground && (
				<style>
					{`
					html, body, #root {
						background:transparent;
					}
					`}
				</style>
			)}
			{children}
		</>
	);
	// return children;
}
