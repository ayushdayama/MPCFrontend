function jsonError(status, detail) {
  return new Response(JSON.stringify({ detail }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

const SESSION_COOKIE = "cycleSenseSession";

function getSessionToken(request) {
  const cookies = request.headers.get("cookie") || "";
  const sessionCookie = cookies
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));

  if (!sessionCookie) return "";

  try {
    return decodeURIComponent(sessionCookie.slice(SESSION_COOKIE.length + 1));
  } catch {
    return "";
  }
}

function sessionCookie(value, secure, maxAge) {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export async function onRequest({ request, env }) {
  let source;
  try {
    source = new URL(request.url);
  } catch {
    return jsonError(400, "Invalid request URL.");
  }

  const apiPath = source.pathname.replace(/^\/api(?:\/|$)/, "/");
  const sessionToken = getSessionToken(request);
  const secure = source.protocol === "https:";

  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    if (request.headers.get("origin") !== source.origin) {
      return jsonError(403, "Cross-origin request rejected.");
    }
  }

  if (request.method === "POST" && apiPath === "/auth/logout") {
    return new Response(null, {
      status: 204,
      headers: { "set-cookie": sessionCookie("", secure, 0) },
    });
  }

  const configuredOrigin = env.RENDER_API_ORIGIN;
  if (!configuredOrigin) {
    return jsonError(503, "Render API is not configured for this Pages deployment.");
  }

  let target;
  try {
    target = new URL(configuredOrigin);
    const isLocalHttp = target.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(target.hostname);
    if (target.protocol !== "https:" && !isLocalHttp) {
      return jsonError(500, "RENDER_API_ORIGIN must use HTTPS (HTTP is allowed for localhost development).");
    }

    target.pathname = `${target.pathname.replace(/\/+$/, "")}${apiPath}`;
    target.search = source.search;
    target.hash = "";
  } catch {
    return jsonError(500, "RENDER_API_ORIGIN is not a valid URL.");
  }

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("cookie");
  headers.delete("authorization");
  if (sessionToken) {
    headers.set("authorization", `Bearer ${sessionToken}`);
  }

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }

  const response = await fetch(new Request(target, init));
  if (
    response.ok &&
    request.method === "POST" &&
    ["/login", "/register"].includes(apiPath)
  ) {
    try {
      const payload = await response.json();
      if (typeof payload.access_token === "string") {
        const token = payload.access_token;
        delete payload.access_token;

        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete("content-length");
        responseHeaders.delete("content-encoding");
        responseHeaders.delete("etag");
        responseHeaders.append(
          "set-cookie",
          sessionCookie(encodeURIComponent(token), secure, 86400),
        );

        return new Response(JSON.stringify(payload), {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        });
      }
    } catch {
      return jsonError(502, "Authentication service returned an invalid response.");
    }
  }

  return response;
}
