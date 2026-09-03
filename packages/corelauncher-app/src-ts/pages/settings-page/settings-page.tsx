import "./settings-page.css";

import { useState } from "react";
import Block from "../../components/layout/block/block";
import useAccountProviders from "../../hooks/use-account-providers";
import useCoreLauncher from "../../hooks/use-corelauncher";

function GeneralSettingsPage() {
	return <div className="page"></div>;
}

function AccountsSettingsPage() {
	const corelauncher = useCoreLauncher();
	const accountProviders = useAccountProviders();
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
							onClick={() => [
								corelauncher.sendMessage("account_connect", {
									id: provider.id,
								}),
							]}
						>
							<img src={provider.icon} alt={provider.name} />
						</button>
					))}
				</div>
			</Block>
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
