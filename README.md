# Cycle Predictor UI (React + Vite)

This project is a React-based web UI for cycle prediction, feedback, and model training, built with Vite for fast development and HMR.

## Features
- Predict the next cycle date and possible alternatives
- Predict all possible cycle dates for a selected month
- Submit feedback on predictions (with optional comments)
- Trigger model training
- Clean, modern UI with responsive design

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

## API
This UI expects a backend API at:
```
https://web-production-4106c.up.railway.app
```
You can change the API base URL in `src/App.jsx` if needed.

## Project Structure
- `src/App.jsx` — Main React component with all UI and logic
- `src/App.css` — Styles matching the original HTML design
