import { MessageType } from "../../../../../types/messages";
import Socket from "../../../../classes/Socket";
import { useAccountStore } from "../../../../stores/AccountStore";
import "./AccountsTab.css";
import { QuestionLg } from "react-bootstrap-icons";

export default function AccountsTab({
	isVisible = true,
}: {
	isVisible?: boolean;
}) {
	const accountProviders = useAccountStore((store) => store.providers);
	const accountInstances = useAccountStore((store) => store.accounts);
	if (!isVisible) return null;

	function connect(id: string) {
		Socket.instance.send(MessageType.StartAccountProviderConnection, { id });
	}

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
							onClick={() => connect(provider.id)}
						>
							<img src={provider.logoUrl} alt={`${provider.name} logo`} />
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
							{instance.avatarUrl ? (
								<img className="icon" src={instance.avatarUrl} alt="avatar" />
							) : (
								<QuestionLg className="icon unknown-icon" />
							)}
							<div>
								<p className="account-name">{instance.name}</p>
								<div className="account-provider">
									<img src={provider.logoUrl} alt="Provider Logo" />
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
