import { API_BASE_URL } from "./constants";
export const apiBase = API_BASE_URL;

export async function apiFetch(url, options) {
  const token = localStorage.getItem("cycleSenseToken");
  const headers = {
    ...options?.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error("API error");
  return res.json();
}
