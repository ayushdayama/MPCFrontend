import { API_BASE_URL } from "./constants";
export const apiBase = API_BASE_URL;

export async function apiFetch(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("API error");
  return res.json();
}
