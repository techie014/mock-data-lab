import {Router} from "itty-router";

import DATA_MAP from "./data/index.js";

const router = Router();

const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), {
        status,
        headers: {"Content-Type": "application/json"},
    });

const notFound = () => json({error: "not found"}, 404);
const unauthorized = () => json({error: "unauthorized"}, 401);

function checkAuth(request, env) {
    const auth = (request.headers.get("Authorization") || "").trim();
    if (!auth.startsWith("Bearer ")) {
        return unauthorized();
    }
    const token = auth.slice(7).trim();
    if (!env.AUTH_TOKEN || token !== env.AUTH_TOKEN) {
        return unauthorized();
    }
    return null;
}

router.get("/data/:key", (req, env) => {
    const authErr = checkAuth(req, env);
    if (authErr) {
        return authErr;
    }

    const {key} = req.params;
    const content = DATA_MAP[key];
    if (!content) {
        return notFound();
    }
    return json(content);
});

router.all("*", () => new Response("Not found", {status: 404}));

export default {
    fetch: (request, env, ctx) => router.handle(request, env, ctx),
};
