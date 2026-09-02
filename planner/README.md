# Planner

A local-first daily/weekly planner: tasks, calendar events, habit tracking, and goals/notes. Built with React + Vite. All data is stored in the browser's `localStorage` — there is no backend or database, so your data stays on whatever device you use it on.

## Features

- **Tasks** — day and week views, add/check off/delete
- **Calendar** — month grid with events per day
- **Habits** — weekly grid with streak tracking
- **Goals & Notes** — a goal checklist plus a free-form notes area
- **Export/Import** — download all your data as a JSON file and re-import it (useful for moving between devices, since nothing syncs automatically)

## Local development

```bash
cd planner
npm install
npm run dev
```

## Building

```bash
npm run build
```

Output goes to `planner/dist`.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy-planner.yml`) builds this app on every push to `main` that touches `planner/` and publishes it to the `gh-pages` branch under `/planner`, alongside the rest of the site.

One-time setup: in the repo's Settings → Pages, set the source to the `gh-pages` branch (root). After that, the planner will be available at `https://<username>.github.io/planner/`.
