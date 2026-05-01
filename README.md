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
- **GitHub Pages** deployments for a static frontend (backend hosted elsewhere) 🚀

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

## Deploy (GitHub Pages) 🌐

This repo deploys to GitHub Pages with `gh-pages`:

```bash
npm run deploy
```

If you deploy under a different repo path/name, update:

- `vite.config.js` `base`
- `package.json` `homepage`

## Notes 🧾

- **Backend must allow CORS** for your UI origin (localhost or GitHub Pages). 🌍
- The UI persists the username in `localStorage` as `cycleSenseUser` (no token auth on the frontend). 🗝️
