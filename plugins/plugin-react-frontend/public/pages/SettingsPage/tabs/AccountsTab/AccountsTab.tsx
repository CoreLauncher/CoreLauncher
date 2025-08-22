import { fetchConnectAccountProvider } from "../../../../functions/api";
import useAccountInstances from "../../../../hooks/useAccountInstances";
import useAccountProviders from "../../../../hooks/useAccountProviders";
import "./AccountsTab.css";
import { QuestionLg } from "react-bootstrap-icons";

export default function AccountsTab({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const accountProviders = useAccountProviders();
	const accountInstances = useAccountInstances();
	if (!isVisible) return null;

	return (
		<div className="AccountsTab">
			<div className="account-providers-container">
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
			<div className="account-instances">
				{accountInstances.map((instance) => {
					const provider = accountProviders.find(
						(provider) => provider.id === instance.providerId,
					);
					if (!provider)
						throw new Error(`Provider not found for instance ${instance.id}`);
					return (
						<div key={instance.id} className="account-instance">
							{/* <img src={instance.icon} /> */}
							<QuestionLg className="icon unknown-icon" />
							<div>
								<p className="account-name">{instance.name}</p>
								<div className="account-provider">
									<img src={provider.logo} alt="Provider Logo" />
									<p>{provider.name} Account</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
