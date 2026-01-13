import { throttling } from "@octokit/plugin-throttling";
import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";
import { env } from "bun";

function createOctokit() {
	const ModifiedOctokit = Octokit.plugin(throttling);
	return new ModifiedOctokit({
		auth: env.GITHUB_CLIENT_SECRET,
		throttle: {
			onRateLimit: (retryAfter, options) => {
				console.log("ratelimit", retryAfter, options);
				return true;
			},
			onSecondaryRateLimit: () => {
				console.log("secondary ratelimit");
				return true;
			},
		},
	});
}

async function fetchReleases() {
	const octokit = createOctokit();
	const releases: RestEndpointMethodTypes["repos"]["listReleases"]["response"]["data"] =
		[];
	let page = 1;

	while (true) {
		const response = await octokit.repos.listReleases({
			owner: "CoreLauncher",
			repo: "CoreLauncher",
			per_page: 5,
			page: page,
		});

		releases.push(...response.data);
		page++;

		if (response.data.length === 0) break;
	}

	return releases.toSorted((releaseA, releaseB) =>
		Bun.semver.order(releaseA.tag_name, releaseB.tag_name),
	);
}

Bun.serve({
	port: env.WEBSERVER_PORT!,
	routes: {
		"/": async () => {
			return new Response("CoreLauncher Updates Server");
		},
		"/check": async (request) => {
			return Response.json({});
		},
	},
});
