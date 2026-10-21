const localApiUrl = import.meta.env.MODE === "cloudflare"
	? "/api"
	: "http://127.0.0.1:8000";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || localApiUrl;