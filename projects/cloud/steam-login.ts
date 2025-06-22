import openId from "openid";

const relyingParty = new openId.RelyingParty(
	"http://localhost:3000/return",
	"http://localhost:3000/",
	true,
	false,
	[],
);

export function getLoginUrl(): Promise<string> {
	return new Promise((resolve, reject) => {
		relyingParty.authenticate(
			"http://steamcommunity.com/openid",
			false,
			(error, authUrl) => {
				if (error || !authUrl) return reject(error || new Error("No auth URL"));
				resolve(authUrl);
			},
		);
	});
}

export function verifySteamResponse(url: string): Promise<string | null> {
	return new Promise((resolve) => {
		relyingParty.verifyAssertion(url, (error, result) => {
			if (error || !result?.authenticated) return resolve(null);

			const match =
				result.claimedIdentifier?.match(/\/id\/(\d+)$/) ||
				result.claimedIdentifier?.match(/\/openid\/id\/(\d+)$/);
			resolve(match?.[1] ?? null);
		});
	});
}
