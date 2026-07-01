# TrackFlow

TrackFlow is an AI-powered engineering management platform for software teams. It keeps the familiar task, sprint, backlog, report, and team workflows, then layers in delivery intelligence that helps engineering leaders plan work, reduce duplicate bugs, predict sprint risk, and communicate releases.

## Product Positioning

TrackFlow is designed for startup and engineering teams that need more than a Jira-style task board. The platform connects execution data with practical AI assistance:

- AI sprint planning from backlog, capacity, priority, and dependency signals
- Bug triage assistant with likely root causes, affected modules, debugging steps, and severity
- Smart duplicate bug detection during ticket creation
- AI task breakdown into frontend, backend, testing, DevOps, and documentation work
- Sprint risk prediction with blockers, overloaded developers, and redistribution guidance
- AI release notes and meeting summary generation
- Engineering health dashboard with executive-level delivery metrics
- Natural-language smart search for queries such as "show all authentication bugs assigned to Alex"
- Command palette and keyboard shortcuts for fast daily workflows

## Current Stack

- React 19 + Vite
- Tailwind CSS
- Zustand state management
- Express API
- SQLite with better-sqlite3
- Socket.io realtime updates
- Nodemailer assignment emails
- Multer attachments
- Jest and Playwright-ready test scripts

## Updated Architecture

```text
TrackFlow
├── server/
│   ├── index.js              # Express API, SQLite schema, auth, realtime events, AI intelligence routes
│   └── db.sqlite             # Local development database
├── src/
│   ├── App.jsx               # App shell, lazy routes, command palette mount
│   ├── components/
│   │   ├── AiActionPanel.jsx # Reusable AI workflow panel
│   │   ├── CommandPalette.jsx
│   │   ├── InsightCard.jsx
│   │   ├── SkeletonBlock.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── TaskModal.jsx
│   ├── lib/
│   │   ├── api.js            # REST client including AI endpoints
│   │   └── socket.js
│   ├── pages/
│   │   ├── Dashboard.jsx     # Engineering health cockpit
│   │   ├── Backlog.jsx       # AI sprint planning
│   │   ├── Sprints.jsx       # Sprint risk prediction
│   │   ├── Reports.jsx       # Release notes and meeting summary generation
│   │   └── Tasks.jsx         # Smart search results
│   └── store/
│       └── useAppStore.js    # Tasks, sprints, members, notifications, AI insights, smart search
```

## AI Implementation

The current AI layer is deterministic and local. It analyzes existing tasks, sprints, members, tags, status, priority, and story points to produce useful recommendations without requiring an external LLM key. The API contracts are intentionally clean so a hosted model can later replace the heuristics without changing the UI.

Core endpoints:

- `GET /api/ai/insights`
- `POST /api/ai/sprint-plan`
- `POST /api/ai/sprint-risk`
- `POST /api/ai/bug-assistant`
- `POST /api/ai/duplicates`
- `POST /api/ai/task-breakdown`
- `POST /api/ai/release-notes`
- `POST /api/ai/meeting-summary`
- `POST /api/ai/search`

## Implementation Plan

1. Preserve existing task, sprint, member, goal, notification, auth, and realtime architecture.
2. Add a server-side AI intelligence layer that derives recommendations from existing SQLite data.
3. Extend the API client and Zustand store with AI insights and natural-language search.
4. Upgrade the dashboard into an engineering health command center.
5. Add AI sprint planning to backlog and risk prediction to sprint review.
6. Add duplicate detection, bug assistant, and task breakdown to ticket creation.
7. Add release notes and meeting summary generation to reports and command palette.
8. Improve UX with reusable AI panels, skeleton loaders, command palette, keyboard shortcuts, empty states, and responsive layouts.
9. Keep AI contracts model-ready for future OpenAI or internal model integration.

## Keyboard Shortcuts

- `Ctrl+K`: focus header search
- `Ctrl+J`: open command palette
- `Escape`: close active overlays or clear focused search

## Getting Started

Install dependencies:

```bash
npm install
cd server && npm install
```

Run the API:

```bash
cd server
npm start
```

Run the frontend:

```bash
npm run dev
```

Demo credentials:

- `sarah@trackflow.io` / `demo123`
- `alex@trackflow.io` / `demo123`
- `admin@trackflow.io` / `admin`

## Resume-Ready Impact Bullets

- Transformed a task tracker into an AI-powered engineering management platform with sprint planning, bug triage, duplicate detection, risk prediction, release communication, and executive health insights.
- Built deterministic AI recommendation services over real delivery data, enabling model-ready product behavior without external infrastructure.
- Improved engineering leadership workflows by surfacing delivery confidence, workload imbalance, blockers, bug trends, and velocity forecasts in one dashboard.
- Reduced duplicate ticket creation and manual triage effort with live similarity scoring, module detection, severity estimation, and debugging guidance.
- Added command-palette-driven workflows and natural-language search to speed up daily navigation, reporting, and task operations.
