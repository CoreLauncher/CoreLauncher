import { fetchConnectAccountProvider } from "../../../../functions/api";
import useAccountProviders from "../../../../hooks/useAccountProviders";
import "./AccountsTab.css";

export default function AccountsTab({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const accountProviders = useAccountProviders();
	if (!isVisible) return null;

	return (
		<div className="AccountsTab">
			<div>
				<p>Connect a new account to CoreLauncher</p>
				<div className="account-providers">
					{accountProviders.map((provider) => (
						<button
							key={provider.id}
							type="button"
							className="account-button"
							style={{ ["--color" as string]: provider.color }}
							onClick={() => fetchConnectAccountProvider(provider.id)}
						>
							<img src={provider.logo} alt={`${provider.name} logo`} />
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
