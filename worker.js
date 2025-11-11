import { AutoRouter } from "itty-router";

import DATA_REGISTRY from "./data";

const router = AutoRouter();

const json = (data, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});

const notFound = (message = "Resource not found") => json({ error: message }, 404);

const unauthorized = (message = "Invalid or missing authentication") => json({ error: message }, 401);

function extractBearerToken(req) {
	const authHeader = req.headers.get("Authorization")?.trim();
	if (!authHeader?.startsWith("Bearer ")) {
		return null;
	}
	return authHeader.slice(7).trim();
}

function authenticate(req, env) {
	const token = extractBearerToken(req);

	if (!token) {
		return unauthorized("Missing Bearer token");
	}

	if (!env.AUTH_TOKEN) {
		console.error("AUTH_TOKEN not configured in environment");
		return json({ error: "Authentication token not configured in environment" }, 500);
	}

	if (token !== env.AUTH_TOKEN) {
		return unauthorized("Invalid authentication token");
	}

	return null;
}

router.get("/projects/:projectKey/data/:dataKey", (req, env) => {
	const authError = authenticate(req, env);
	if (authError) {
		return authError;
	}

	const { projectKey, dataKey } = req.params;
	const data = DATA_REGISTRY?.[projectKey]?.[dataKey];
	if (!data) {
		return notFound();
	}
	return json(data);
});

export default {
	...router,
	fetch: async (req, env) => {
		const { success } = await env.rateLimiter.limit({ key: "local" });
		if (!success) {
			return new Response(`429 Failure – rate limit exceeded`, { status: 429 });
		}
		return router.fetch(req, env);
	},
};
