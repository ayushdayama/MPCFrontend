# Cycle Sense (UI) 🌸

Minimal React + Vite frontend for **cycle tracking + prediction**. 📅✨

Cycle Sense helps users **log menstrual cycle start dates**, **view history + basic stats**, and **get predicted next cycle dates** (plus a simple fertility window estimate). It targets a lightweight, private-feeling UX that works with a separate backend API. 💗🔗

## What this project does ✅

- **Login / Sign up / Forgot password** 🔐
- **Log cycle dates** (cycle start) 📝
- **History + stats** (timeline + average/range cycle length) 📈
- **Predictions** (next date + alternatives; projections for a chosen month) 🔮
- **Model training controls** (trigger training + view status; requires backend support) 🧠⚙️

## Who it’s for 🎯

- **End users** tracking cycles and viewing predictions 🙋‍♀️
- **Developers** running the UI locally against the Cycle Sense backend 🧑‍💻
- **Cloudflare Pages** deployments using a same-origin API proxy 🚀

## Clone, install, run 🧩

```bash
git clone <YOUR_REPO_URL>
cd cycle-predictor-ui
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Configure backend 🔧

Set the backend base URL (defaults to `http://127.0.0.1:8000`):

```powershell
setx VITE_API_BASE_URL "http://127.0.0.1:8000"
```

Restart `npm run dev` after changing env vars.

## Build / lint 🛠️

```bash
npm run build
npm run preview
npm run lint
```

## Deploy (Cloudflare Pages) 🌐

Build the static UI and Pages Function with:

```bash
npm run build:cloudflare
```

Set the `RENDER_API_ORIGIN` Pages environment variable to the HTTPS origin of the backend. The `/api` Pages Function proxies API requests to it.

## Session security 🔐

Cloudflare deployments store the session in a 24-hour `HttpOnly`, `Secure`, `SameSite=Lax` cookie; the JWT is not exposed to frontend JavaScript or stored in LocalStorage. Logout clears the cookie. Legacy `cycleSenseToken`, `cycleSenseUser`, and `cycleSenseWelcomeShown` LocalStorage entries are removed when the app loads.

For local development against a directly hosted backend, the JWT remains in memory only and is lost on reload. Configure backend CORS for the local UI origin when using this mode.
