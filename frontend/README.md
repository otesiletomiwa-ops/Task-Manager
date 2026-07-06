# Task Manager — Frontend

A React (Vite) frontend for the Express + Prisma Task Manager API.

## Stack

- React 18 + React Router 6
- Vite (dev server + build)
- Plain CSS — no UI framework, no build-step CSS tooling

## Setup

```bash
cd task-manager-frontend
npm install
cp .env.example .env
```

Open `.env` and confirm it points at your backend:

```
VITE_API_URL=http://localhost:5001/api
```

## Run

Make sure your Express backend is already running on port 5001 (or whatever
port you set, matching `VITE_API_URL`).

```bash
npm run dev
```

Vite will start on **http://localhost:5173**. Open that in your browser.

## What it does

- **/signup** — create an account, then redirects you to /login (your backend's
  signup endpoint doesn't return a token, only login does).
- **/login** — authenticates against `/api/auth/login`, stores the JWT and user
  in `localStorage`, then redirects to the dashboard.
- **/** (Dashboard, protected) — lists your tasks, lets you create a task,
  click the status dot to cycle pending → in-progress → completed, edit a
  task's title/description/priority/due date inline, delete a task, and
  filter by status.

All requests automatically attach `Authorization: Bearer <token>` once you're
logged in. If your backend's error handler returns `{ error: "..." }` or
`{ error: [zod issues] }`, both shapes are parsed and shown as a readable
error message.

## CORS note

Your backend already has `app.use(cors())` with no origin restriction, so it
will accept requests from this app running on a different port
(`localhost:5173` → `localhost:5001`) with no extra config needed.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file host — just make sure
`VITE_API_URL` is set correctly at build time for whatever environment you
deploy the backend to.
