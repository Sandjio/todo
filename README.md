# Todo App

A Todoist-backed task manager built with React Router v7, MUI, and React Query. The app is a client-rendered React 19 SPA that wraps the public [Todoist REST API v1](https://developer.todoist.com/api/v1) behind a small set of task-management views.

## Features

- Create, read, update, and delete Todoist tasks (title, description, due date, project, urgency, labels)
- **Inbox / Dashboard** — full task list with search, priority filter, project filter, and cursor-based pagination
- **Today** — tasks due today
- **Upcoming** — tasks due in the next 7 days
- **Projects** — grid of Todoist projects; selecting one filters the dashboard
- **Task detail** page with inline edit and delete confirmation
- Urgency levels (`LOW` / `MED` / `HIGH`) mapped to Todoist priority 4 / 2 / 1

Not yet implemented: the **Archive** and **Trash** routes are placeholder stubs. The **`/admin`** route is a React-Admin demo wired to JSONPlaceholder and is unrelated to Todoist.

## Tech stack

- **React 19** with **React Router 7** in framework mode (client-side rendering, `ssr: false`)
- **TypeScript** and **Vite 8**
- **MUI 7** with Emotion
- **TanStack React Query 5** for server state; **Zustand 5** for filter state
- **Axios** HTTP client
- **React-Admin 5** (demo section only)

## Project layout

```
app/
├── routes/        React Router route modules (home, dashboard, task, today, upcoming, projects, archive, trash, admin)
├── components/    UI: SideBar, TopNav, NewTask, Dashboard (TaskList, EditTaskDialog, ConfirmDeleteDialog), FilterBar, AdminApp
├── hooks/         useTasks, useTask, useProjects, useCreateTask, useUpdateTask, useDeleteTask, useDebounce
├── store/         Zustand filter store (search, priority, projectId, cursor)
├── utils/         Axios client (api.ts), Todoist service wrapper (todoist.service.ts), urgency mapping
├── lib/           React Query keys
└── types/         Todoist API TypeScript types
```

Route map is declared in [`app/routes.ts`](app/routes.ts).

## Prerequisites

- Node.js 22+ and npm
- A Todoist API token — generate one at https://todoist.com/app/settings/integrations/developer

## Getting started

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_TODOIST_API_TOKEN=<your-todoist-api-token>
```

`.env` is already listed in `.gitignore` — do not commit your token.

Start the dev server:

```bash
npm run dev
```

The Vite dev server proxies `/api/todoist/*` to `https://api.todoist.com/api/v1/*` (see [`vite.config.ts`](vite.config.ts)), so there is no CORS setup to do.

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the React Router dev server with HMR |
| `npm run build` | Build the production bundle |
| `npm run lint` | Run ESLint over the project |
| `npm run preview` | Preview the production build locally |

## Running with Docker

The repo ships a multi-stage [`Dockerfile`](Dockerfile) (Node 22 Alpine build → Nginx Alpine runtime) and a [`docker-compose.yml`](docker-compose.yml) that maps host port `3000` to container port `80`.

Compose reads the token from your host shell:

```bash
export VITE_TODOIST_API_TOKEN=<your-todoist-api-token>
docker compose up --build
```

The app is then served at http://localhost:3000. Inside the container, Nginx ([`nginx.conf`](nginx.conf)) reverse-proxies `/api/todoist/*` to the Todoist API and falls back to `index.html` for SPA routing.

Because `VITE_TODOIST_API_TOKEN` is a `VITE_*` variable, it is baked into the built JavaScript bundle at build time. That is fine for a personal deployment, but do not publish the built image — anyone with the bundle can extract the token.

## Architecture notes

All Todoist calls go through a single axios instance in [`app/utils/api.ts`](app/utils/api.ts) targeting the relative path `/api/todoist`. Both the Vite dev server and the production Nginx image proxy that prefix upstream to `https://api.todoist.com/api/v1`. This keeps the browser same-origin (no CORS) and isolates the Todoist base URL to one place.

Endpoint definitions live in [`app/utils/todoist.service.ts`](app/utils/todoist.service.ts); React Query cache keys live in [`app/lib/queryKeys.ts`](app/lib/queryKeys.ts). Adding a new Todoist endpoint means adding one method in the service and one key in `queryKeys`.

## Known limitations

- Archive and Trash routes render headings only — no task data is wired up.
- Client-side rendering only — there is no SSR, and the Todoist token is a browser-side secret.
