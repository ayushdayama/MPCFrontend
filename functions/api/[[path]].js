function jsonError(status, detail) {
  return new Response(JSON.stringify({ detail }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function onRequest({ request, env }) {
  const configuredOrigin = env.RENDER_API_ORIGIN;
  if (!configuredOrigin) {
    return jsonError(503, "Render API is not configured for this Pages deployment.");
  }

  let target;
  try {
    const source = new URL(request.url);
    target = new URL(configuredOrigin);
    if (target.protocol !== "https:" && target.protocol !== "http:") {
      return jsonError(500, "RENDER_API_ORIGIN must use HTTP or HTTPS.");
    }

    const apiPath = source.pathname.replace(/^\/api(?:\/|$)/, "/");
    target.pathname = `${target.pathname.replace(/\/+$/, "")}${apiPath}`;
    target.search = source.search;
    target.hash = "";
  } catch {
    return jsonError(500, "RENDER_API_ORIGIN is not a valid URL.");
  }

  const headers = new Headers(request.headers);
  headers.delete("host");
  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }

  return fetch(new Request(target, init));
}
