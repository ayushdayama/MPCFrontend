import { API_BASE_URL } from "./constants";
export const apiBase = API_BASE_URL;

let authToken = "";

export function setApiAuthToken(token) {
  authToken = token || "";
}

export async function apiFetch(url, options) {
  const headers = {
    ...options?.headers,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}
