import "./settings-page.css";

import { useState } from "react";
import { TrashFill } from "react-bootstrap-icons";
import Block from "../../components/layout/block/block";
import useAccountInstances from "../../hooks/use-account-instances";
import useAccountProviders from "../../hooks/use-account-providers";
import useCoreLauncher from "../../hooks/use-corelauncher";

function GeneralSettingsPage() {
	return <div className="page"></div>;
}

function AccountsSettingsPage() {
	const corelauncher = useCoreLauncher();
	const accountProviders = useAccountProviders();
	const accountInstances = useAccountInstances();

	return (
		<div className="page accounts">
			<Block className="account-providers">
				<p>
					Add an account to your CoreLauncher by selecting one of the providers
					below.
				</p>
				<div className="items">
					{accountProviders.map((provider) => (
						<button
							key={provider.id}
							type="button"
							className="account-provider"
							style={{
								backgroundColor: provider.color,
							}}
							onClick={() => [corelauncher.connectAccountInstance(provider)]}
						>
							<img src={provider.icon} alt={provider.name} />
						</button>
					))}
				</div>
			</Block>
			<div className="account-instances">
				{accountInstances.map((instance) => (
					<Block key={instance.id} className="account-instance">
						{instance.avatar ? (
							<img src={instance.avatar} alt={instance.name} />
						) : (
							<div className="avatar-placeholder">{instance.name[0]}</div>
						)}
						<div className="account-info">
							<span className="account-name">{instance.name}</span>
							<span className="account-provider">
								{
									accountProviders.find((p) => p.id === instance.providerId)
										?.name
								}
							</span>
						</div>
						<button
							type="button"
							className="delete-button"
							onClick={() => corelauncher.disconnectAccountInstance(instance)}
						>
							<TrashFill />
						</button>
					</Block>
				))}
			</div>
		</div>
	);
}

export default function SettingsPage() {
	const [page, setPage] = useState("general");

	const pages = [
		{
			id: "general",
			name: "General",
		},
		{
			id: "accounts",
			name: "Accounts",
		},
	];

	return (
		<div className="SettingsPage">
			<Block className="tabs">
				{pages.map((p) => (
					<button
						key={p.id}
						type="button"
						className={`tab ${page === p.id ? "active" : ""}`}
						onClick={() => setPage(p.id)}
					>
						{p.name}
					</button>
				))}
			</Block>
			{page === "general" && <GeneralSettingsPage />}
			{page === "accounts" && <AccountsSettingsPage />}
		</div>
	);
}
