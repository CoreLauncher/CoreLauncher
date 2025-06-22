import { getLoginUrl, verifySteamResponse } from "./steam-login";

Bun.serve({
	port: 3000,

	routes: {
		"/": async () => {
			return new Response(`<a href="/login">Login with Steam</a>`, {
				status: 200,
				headers: { "Content-Type": "text/html" },
			});
		},

		"/login": async () => {
			const authUrl = await getLoginUrl();
			return Response.redirect(authUrl, 302);
		},

		"/return": async (request) => {
			const steamId = await verifySteamResponse(request.url);
			if (steamId) {
				return new Response(`Logged in as SteamdId64: ${steamId}`, {
					status: 200,
				});
			}
			return new Response("Login failed", { status: 403 });
		},
	},

	fetch() {
		return new Response("404 Not Found", { status: 404 });
	},
});
