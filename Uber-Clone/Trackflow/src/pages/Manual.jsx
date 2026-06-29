const Section = ({ title, children }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", borderBottom: "2px solid var(--border)", paddingBottom: 8, marginBottom: 16 }}>{title}</h2>
    {children}
  </div>
);

const Sub = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{title}</h3>
    {children}
  </div>
);

const Code = ({ children }) => (
  <code style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 7px", fontSize: 12, fontFamily: "monospace", color: "var(--text-primary)" }}>{children}</code>
);

const Block = ({ children }) => (
  <pre style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", fontSize: 12, fontFamily: "monospace", color: "var(--text-primary)", overflowX: "auto", lineHeight: 1.7, margin: "10px 0" }}>{children}</pre>
);

const P = ({ children }) => (
  <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 10 }}>{children}</p>
);

const Pill = ({ children, color = "#6366f1" }) => (
  <span style={{ display: "inline-block", background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600, marginRight: 6, marginBottom: 4 }}>{children}</span>
);

const Table = ({ headers, rows }) => (
  <div style={{ overflowX: "auto", marginBottom: 12 }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: "var(--bg-surface)" }}>
          {headers.map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-primary)", fontWeight: 600, borderBottom: "1px solid var(--border)" }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
            {row.map((cell, j) => <td key={j} style={{ padding: "8px 12px", color: "var(--text-muted)", verticalAlign: "top" }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function Manual() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "8px 0 60px" }}>

      {/* Title */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>TrackFlow — Study Manual</h1>
        <P>A complete technical reference for every file, component, store, and design decision in the TrackFlow project. Use this as a study guide, presentation reference, or onboarding document.</P>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {["React 19","Vite 8","Tailwind CSS 4","Zustand 5","React Router 7","Recharts 3","dnd-kit 6","Express","SQLite","Socket.io","Multer","Nodemailer","Jest","Playwright"].map(t => <Pill key={t}>{t}</Pill>)}
        </div>
      </div>

      {/* 1. Project Overview */}
      <Section title="1. Project Overview">
        <P>TrackFlow is a full-stack project management application. The frontend is a React SPA that renders UI, manages client-side routing, and connects to a backend API. The backend is an Express server with SQLite persistence, login authentication, and task/sprint/goal CRUD endpoints.</P>
        <Sub title="What it does">
          <P>It simulates a software team workspace with tasks, sprints, goals, reports, and team management. Users can log in, browse and filter tasks, drag cards on a Kanban board, create and edit tasks, and review analytics.</P>
        </Sub>
        <Sub title="Folder structure">
          <Block>{`src/
├── components/       # Shared UI (Header, Sidebar, TaskModal, NotificationPanel)
├── pages/            # One file per route/page
├── store/            # Zustand global state (3 stores)
├── App.jsx           # Router + layout shell
├── main.jsx          # Entry point
└── style.css         # CSS variables + dark mode overrides`}</Block>
        </Sub>
      </Section>

      {/* 1.5. How the App Works */}
      <Section title="1.5. How the App Works — Deep Dive for Interviews">
        <P>TrackFlow is designed as a comprehensive project management tool inspired by platforms like Jira or Trello, but built with modern web technologies. Below is a detailed explanation of its architecture, data flow, user interactions, and key features, suitable for technical interviews.</P>

        <Sub title="Application Architecture">
          <P>The app follows a client-server architecture with a React frontend and an Express.js backend. The frontend is a Single Page Application (SPA) built with Vite, using React Router for navigation. State is managed globally with Zustand stores, avoiding prop drilling. The backend provides RESTful APIs and real-time updates via WebSockets.</P>
          <P>On startup, <Code>main.jsx</Code> renders the App component inside a BrowserRouter. The App component checks authentication status using <Code>useAuthStore</Code>. If not logged in, it renders the Login page; otherwise, it renders the AppShell, which includes the sidebar, header, and routed pages.</P>
        </Sub>

        <Sub title="User Authentication and Session Management">
          <P>Authentication is handled via JWT tokens. When a user logs in, the frontend sends credentials to <Code>/api/auth/login</Code>. The backend verifies them against seeded users in SQLite, generates a JWT, and returns it along with user profile data. The token is stored in localStorage and included in all subsequent API requests via the <Code>api.js</Code> wrapper.</P>
          <P>The <Code>useAuthStore</Code> manages login state, user info, and logout. On logout, the token is cleared, and the app redirects to login. Route protection ensures unauthenticated users can't access protected routes.</P>
        </Sub>

        <Sub title="Data Fetching and State Management">
          <P>Upon successful login, the AppShell calls <Code>fetchAll()</Code> from <Code>useAppStore</Code>, which concurrently fetches tasks, sprints, goals, and members from the backend. This data is stored in Zustand state, making it reactive across components.</P>
          <P>Zustand stores are lightweight and synchronous. Actions like creating a task update the local state optimistically, then call the API. If the API fails, the state is reverted. Loading states and errors are tracked per resource, displayed via the LoadingBar and error messages.</P>
          <P>Real-time updates are handled via Socket.io. When a task is modified, the backend broadcasts the change to all connected clients, which update their Zustand state accordingly. This ensures consistency without manual refreshes.</P>
        </Sub>

        <Sub title="Navigation and Layout">
          <P>The app uses React Router for client-side routing. The sidebar (Sidebar component) lists all pages, with active states and icons. On mobile, the sidebar slides in/out with CSS transforms. The header (Header component) shows the current page title, search bar, and notification panel toggle.</P>
          <P>The main content area renders the current route's component. Each page component subscribes to relevant store slices and re-renders on state changes. Filters and search are global, affecting multiple pages.</P>
        </Sub>

        <Sub title="Task Management Workflow">
          <P>Tasks are the core entity. Users can view tasks in list (Tasks page), Kanban board (Board page), timeline (Timeline), or backlog (Backlog). Creating a task opens the TaskModal, which allows editing title, description, status, priority, assignee, tags, attachments, and comments.</P>
          <P>On the Board page, tasks are draggable using dnd-kit. Dropping a task updates its status and calls the API. The Tasks page offers filtering by status, priority, type, and search. The Timeline page visualizes tasks on a Gantt-like chart using Recharts.</P>
          <P>Attachments are uploaded via Multer on the backend, stored in <Code>server/uploads/</Code>, and served statically. Emails are sent on assignment using Nodemailer.</P>
        </Sub>

        <Sub title="Advanced Features and Scalability">
          <P>Role-based access control (RBAC) restricts actions like task deletion to admins. The backend middleware checks user roles from the JWT.</P>
          <P>Reports and Dashboard use Recharts for visualizations, aggregating data from the store. Goals track progress, sprints manage time-boxed work.</P>
          <P>The app is tested with Jest for units, Supertest for APIs, and Playwright for E2E. CI/CD with GitHub Actions ensures quality.</P>
          <P>Scalability considerations: SQLite is suitable for demo; production would use PostgreSQL. WebSockets enable real-time collaboration. The modular component structure allows easy extension.</P>
        </Sub>

        <Sub title="Common Interview Questions and Answers">
          <P><strong>Q: How does state management work?</strong> A: Zustand provides a simple store with actions. Components use hooks to access state, triggering re-renders on changes. It's synchronous and avoids Redux complexity.</P>
          <P><strong>Q: Explain the data flow for creating a task.</strong> A: User clicks 'New Task', TaskModal opens. On submit, <Code>createTask</Code> in store calls API, updates local state, broadcasts via Socket.io.</P>
          <P><strong>Q: How is authentication secured?</strong> A: JWT tokens in localStorage, validated on each request. HTTPS in production prevents interception.</P>
          <P><strong>Q: Why Vite over Create React App?</strong> A: Faster dev server with HMR, better build performance, modern ES modules.</P>
        </Sub>
      </Section>

      {/* 2. Tech Stack */}
      <Section title="2. Tech Stack Explained">
        <Table
          headers={["Library", "Version", "Purpose"]}
          rows={[
            ["React", "19", "UI component framework — renders the interface"],
            ["Vite", "6", "Build tool & dev server — fast HMR, bundles for production"],
            ["Tailwind CSS", "4", "Utility-first CSS — most layout/spacing/colour classes"],
            ["Zustand", "5", "Lightweight global state — replaces Redux for this scale"],
            ["React Router", "7", "Client-side routing — maps URLs to page components"],
            ["Recharts", "3", "Chart library built on D3 — used in Dashboard & Reports"],
            ["dnd-kit", "6", "Drag-and-drop — used on the Board (Kanban) page"],
            ["Lucide React", "latest", "Icon set — consistent SVG icons throughout the app"],
            ["Express", "4", "Backend API server for auth and CRUD endpoints"],
            ["SQLite", "3", "Embedded persistence storage used by the server"],
            ["Socket.io", "latest", "Real-time WebSockets for live task updates"],
            ["Multer", "latest", "File upload handling for task attachments"],
            ["Nodemailer", "latest", "Email notifications for task assignments"],
            ["Jest", "latest", "Unit testing framework for frontend and backend"],
            ["Playwright", "latest", "End-to-end testing for UI flows"],
          ]}
        />
      </Section>

      {/* 3. Entry Point */}
      <Section title="3. Entry Point — main.jsx">
        <P>This is the very first file that runs. It mounts the React app into the HTML page.</P>
        <Block>{`import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);`}</Block>
        <Table
          headers={["Concept", "Explanation"]}
          rows={[
            ["StrictMode", "React dev tool — runs effects twice to catch bugs. Has no effect in production."],
            ["BrowserRouter", "Enables React Router — reads the URL and renders the matching route."],
            ["createRoot", "React 18+ API — replaces the old ReactDOM.render()."],
            ["#root", "The <div id=\"root\"> in index.html — React takes over this element."],
          ]}
        />
      </Section>

      <Section title="API and Backend">
        <P>The frontend communicates with the backend through JSON endpoints under <Code>/api</Code>. The Vite dev server proxies these requests to the Express server running on port 3001.</P>
        <Sub title="Frontend API layer">
          <P>The file <Code>src/lib/api.js</Code> is the centralized API client. It wraps <Code>fetch()</Code>, adds JSON headers, attaches the JWT bearer token from localStorage, and throws readable errors when the server responds with failure.</P>
        </Sub>
        <Sub title="Backend server" />
        <P>The backend in <Code>server/index.js</Code> provides auth and data persistence. It creates SQLite tables on startup, seeds demo users and tasks, and protects routes with JWT auth middleware.</P>
        <Sub title="Key backend endpoints" />
        <Table
          headers={["Endpoint", "Purpose"]}
          rows={[
            ["POST /api/auth/login", "Logs in users and returns a JWT token and safe user profile."],
            ["GET /api/tasks", "Fetches tasks."],
            ["POST /api/tasks", "Creates a new task."],
            ["PATCH /api/tasks/:id", "Updates a task."],
            ["DELETE /api/tasks/:id", "Deletes a task (admin only)."],
            ["POST /api/tasks/:id/upload", "Uploads a file attachment to a task."],
            ["GET /api/sprints", "Fetches sprints."],
            ["GET /api/goals", "Fetches goals."],
            ["GET /api/members", "Fetches team members."],
          ]}
        />
      </Section>

      <Section title="Advanced Features">
        <P>TrackFlow includes several advanced features to demonstrate production-level capabilities: real-time updates, role-based access control, file uploads, email notifications, comprehensive testing, and CI/CD automation.</P>

        <Sub title="Real-Time Updates with WebSockets">
          <P>Using Socket.io, task changes are broadcasted instantly to all connected clients. When a user creates, updates, or deletes a task, other users see the changes without refreshing. The frontend connects on login and listens for events to update Zustand state.</P>
        </Sub>

        <Sub title="Role-Based Access Control (RBAC)">
          <P>Users have roles (e.g., Administrator, Product Lead). Certain actions, like deleting tasks, require admin privileges. The backend checks roles via middleware, and the frontend hides/shows UI elements based on the current user's role.</P>
        </Sub>

        <Sub title="File Uploads">
          <P>Tasks can have file attachments. The backend uses Multer to handle uploads, storing files in <Code>server/uploads/</Code>. Files are served statically and linked to tasks via the <Code>attachments</Code> array.</P>
        </Sub>

        <Sub title="Email Notifications">
          <P>Nodemailer sends emails on task assignments using Ethereal (demo SMTP). When a task is created with an assignee, an email is sent to the assignee's email address.</P>
        </Sub>

        <Sub title="Testing Suite">
          <P>Jest handles unit tests for components and API logic. Supertest tests backend endpoints. Playwright runs end-to-end tests for UI flows like login and task creation. Run <Code>npm test</Code> for unit tests and <Code>npm run test:e2e</Code> for E2E.</P>
        </Sub>

        <Sub title="CI/CD with GitHub Actions">
          <P>Automated workflows in <Code>.github/workflows/ci.yml</Code> run linting, tests, and builds on every push/PR to the main branch, ensuring code quality and preventing regressions.</P>
        </Sub>
      </Section>

      {/* 4. App.jsx */}
      <Section title="4. App.jsx — Router & Layout Shell">
        <P>App.jsx has three responsibilities: route guarding (auth), the app shell layout (sidebar + header + main), and defining all routes.</P>
        <Sub title="useIsDesktop hook">
          <P>A custom hook that returns <Code>true</Code> when the viewport is ≥ 1024px. It adds a <Code>resize</Code> event listener and cleans it up on unmount.</P>
          <Block>{`function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isDesktop;
}`}</Block>
        </Sub>
        <Sub title="AppShell component">
          <P>Renders the persistent sidebar, header, and the <Code>{"<Routes>"}</Code> outlet. The sidebar is <Code>position: fixed</Code> on mobile and slides in/out via CSS <Code>transform: translateX</Code>. On desktop it is <Code>position: relative</Code> and always visible.</P>
        </Sub>
        <Sub title="LoginRoute component">
          <P>Handles the <Code>/login</Code> route. If the user is already logged in, it redirects to <Code>/dashboard</Code>. Otherwise it renders the Login page. This prevents logged-in users from seeing the login screen.</P>
        </Sub>
        <Sub title="Route guard in App">
          <Block>{`<Route path="/*" element={isLoggedIn ? <AppShell /> : <Navigate to="/login" replace />} />`}</Block>
          <P>Every route except <Code>/login</Code> is protected. Unauthenticated users are always sent to <Code>/login</Code>.</P>
        </Sub>
        <Sub title="All routes">
          <Table
            headers={["Path", "Component"]}
            rows={[
              ["/dashboard", "Dashboard"],
              ["/board", "Board (Kanban)"],
              ["/list", "Tasks (List view)"],
              ["/timeline", "Timeline"],
              ["/backlog", "Backlog"],
              ["/goals", "Goals"],
              ["/sprints", "Sprints"],
              ["/reports", "Reports"],
              ["/team", "Team"],
              ["/settings", "Settings"],
              ["/about", "About"],
              ["/manual", "Manual (this page)"],
            ]}
          />
        </Sub>
      </Section>

      {/* 5. Stores */}
      <Section title="5. Global State — Zustand Stores">
        <P>Zustand is a minimal state management library. Each store is a custom hook created with <Code>create()</Code>. Components call the hook and get both state values and action functions.</P>

        <Sub title="useAppStore.js — Main data store">
          <P>Holds all application data: tasks, members, sprints, goals, notifications, and UI state (modal open, search query, filters).</P>
          <Table
            headers={["State key", "Type", "Description"]}
            rows={[
              ["tasks", "Array[15]", "All task objects with id, title, status, priority, assignee, tags, etc."],
              ["members", "Array[6]", "Team member objects with name, role, initials, color, avatar"],
              ["sprints", "Array[3]", "Sprint objects with name, status, startDate, endDate"],
              ["goals", "Array[4]", "Goal objects with title, progress (0–100), status, owner"],
              ["notifications", "Array[5]", "Notification objects with id, text, read, type"],
              ["taskModalOpen", "boolean", "Controls TaskModal visibility"],
              ["selectedTask", "object|null", "The task currently open in the modal"],
              ["notifPanelOpen", "boolean", "Controls NotificationPanel visibility"],
              ["searchQuery", "string", "Global search string shared by Tasks, Board, Backlog"],
              ["filterStatus", "string", "Active status filter on Tasks page"],
              ["filterPriority", "string", "Active priority filter on Tasks page"],
              ["filterType", "string", "Active type filter on Tasks page"],
            ]}
          />
          <P>Key actions:</P>
          <Table
            headers={["Action", "What it does"]}
            rows={[
              ["addTask(task)", "Appends a new task to the tasks array"],
              ["updateTask(id, changes)", "Merges changes into the matching task by id"],
              ["deleteTask(id)", "Filters out the task with the given id"],
              ["moveTask(id, newStatus)", "Shortcut to update just the status (used by Board drag-drop)"],
              ["openTaskModal(task)", "Sets selectedTask and taskModalOpen = true"],
              ["closeTaskModal()", "Clears selectedTask and closes modal"],
              ["addGoal / updateGoal", "Append or merge-update a goal"],
              ["addSprint / updateSprint", "Append or merge-update a sprint"],
              ["dismissNotif(id)", "Filters out a notification by id"],
              ["markAllRead()", "Sets read: true on all notifications"],
              ["setSearchQuery(q)", "Updates global search string"],
              ["setFilterStatus/Priority/Type", "Updates individual filter values"],
              ["clearFilters()", "Resets all filters and search to empty string"],
            ]}
          />
        </Sub>

        <Sub title="useAuthStore.js — Authentication store">
          <P>Manages login state. Contains 3 hardcoded demo users. No real API — <Code>login()</Code> uses <Code>setTimeout</Code> to simulate a 900ms network delay.</P>
          <Block>{`// Simulated login
login: async (email, password) => {
  set({ loading: true, error: null });
  await new Promise(r => setTimeout(r, 900));
  const user = demoUsers.find(u => u.email === email && u.password === password);
  if (!user) { set({ loading: false, error: "Invalid credentials" }); return false; }
  set({ currentUser: user, isLoggedIn: true, loading: false });
  return true;
}`}</Block>
          <Table
            headers={["State key", "Description"]}
            rows={[
              ["isLoggedIn", "Boolean — drives the route guard in App.jsx"],
              ["currentUser", "The logged-in user object (name, role, email, initials, color)"],
              ["loading", "True while the simulated API call is in progress"],
              ["error", "Error message string if login fails"],
            ]}
          />
        </Sub>

        <Sub title="useThemeStore.js — Dark mode store">
          <P>Single boolean <Code>dark</Code> with one action <Code>toggleDark()</Code>. The action directly mutates the DOM:</P>
          <Block>{`toggleDark: () => set(s => {
  const next = !s.dark;
  document.documentElement.classList.toggle("dark", next);
  return { dark: next };
})`}</Block>
          <P>This is why dark mode works without Tailwind's built-in darkMode config — it's driven entirely by CSS custom properties.</P>
        </Sub>
      </Section>

      {/* 6. CSS / Theming */}
      <Section title="6. Theming — style.css">
        <P>All colours are defined as CSS custom properties (variables) on <Code>:root</Code> for light mode and overridden under <Code>.dark</Code> for dark mode. This means every component automatically responds to theme changes without any conditional logic in JSX.</P>
        <Block>{`:root {
  --bg-base:      #eef0f6;   /* page background */
  --bg-surface:   #ffffff;   /* cards, panels */
  --border:       #d8dde8;   /* borders */
  --text-primary: #1e2433;   /* headings */
  --text-muted:   #7c8fa6;   /* secondary text */
  --text-subtle:  #a0aec0;   /* placeholders */
}

.dark {
  --bg-base:      #0f1117;
  --bg-surface:   #1a1d27;
  --border:       #2a2d3a;
  --text-primary: #e8eaf0;
  --text-muted:   #8b92a5;
  --text-subtle:  #5a6070;
}`}</Block>
        <P>The file also contains Tailwind overrides for dark mode — e.g. <Code>.dark .bg-white</Code> maps to <Code>var(--bg-surface)</Code> so Tailwind utility classes still work correctly in dark mode without changing JSX.</P>
      </Section>

      {/* 7. Components */}
      <Section title="7. Shared Components">

        <Sub title="Header.jsx">
          <P>The top bar rendered on every page inside AppShell. Key features:</P>
          <Table
            headers={["Feature", "Implementation"]}
            rows={[
              ["Live search dropdown", "Local state localQuery, filters tasks by title/id/tag, shows max 6 results"],
              ["⌘K shortcut", "useEffect adds keydown listener for metaKey+k to focus the input"],
              ["Escape clears", "onKeyDown on input: if Escape, clear query and blur"],
              ["Enter navigates", "On Enter, commits query to store via setSearchQuery, navigates to /list"],
              ["Dark mode toggle", "Calls toggleDark() from useThemeStore, shows Sun/Moon icon"],
              ["Bell icon", "Shows red dot if any notification is unread, toggles NotificationPanel"],
              ["Avatar dropdown", "Click toggles a dropdown with profile info, Settings/Team links, Logout"],
              ["Hamburger", "lg:hidden — only visible on mobile, calls onMenuClick to open sidebar"],
            ]}
          />
        </Sub>

        <Sub title="Sidebar.jsx">
          <P>The left navigation panel. Always visible on desktop, slides in as an overlay on mobile. Contains three nav groups (WORKSPACE, PLANNING, bottom items), a search bar, and a user profile strip at the bottom.</P>
          <P><Code>SidebarSearch</Code> is a sub-component inside Sidebar.jsx. It filters tasks live and navigates to <Code>/list</Code> with the task ID as the search query on selection.</P>
          <P><Code>MenuItem</Code> uses <Code>useLocation()</Code> to compare the current URL path and apply active styles.</P>
        </Sub>

        <Sub title="TaskModal.jsx">
          <P>A full-screen modal overlay for viewing/editing a task. It reads <Code>taskModalOpen</Code> and <Code>selectedTask</Code> from the store. The outer wrapper is <Code>fixed inset-0</Code> with <Code>overflow-y-auto</Code> so it scrolls on small screens instead of clipping content.</P>
        </Sub>

        <Sub title="NotificationPanel.jsx">
          <P>A slide-in panel from the right showing all notifications. Each item has a dismiss (×) button that calls <Code>dismissNotif(id)</Code>. Uses CSS variables throughout for dark mode compatibility.</P>
        </Sub>
      </Section>

      {/* 8. Pages */}
      <Section title="8. Pages">

        <Sub title="Login.jsx">
          <P>Two-panel layout: decorative left panel (hidden on mobile) + form right panel. Uses <Code>useAuthStore</Code> for <Code>login()</Code> and <Code>demoLogin()</Code>. Layout uses <Code>min-h-screen flex</Code> (no overflow-hidden) so it scrolls correctly on small screens.</P>
        </Sub>

        <Sub title="Dashboard.jsx">
          <P>The home page. Shows KPI cards (total tasks, in-progress, completed, overdue), an activity heatmap, a bar chart of tasks by status, and a recent activity feed. Charts use Recharts. KPI icon backgrounds use <Code>rgba()</Code> so they work in both light and dark mode.</P>
        </Sub>

        <Sub title="Board.jsx (Kanban)">
          <P>Drag-and-drop Kanban board using dnd-kit. Tasks are grouped into columns by status. Dragging a card calls <Code>moveTask(id, newStatus)</Code>. Has a local search filter that also respects the global <Code>searchQuery</Code>.</P>
        </Sub>

        <Sub title="Tasks.jsx (List view)">
          <P>Paginated table of all tasks. Features:</P>
          <Table
            headers={["Feature", "Detail"]}
            rows={[
              ["Filters", "Status, Priority, Type dropdowns + global searchQuery pill"],
              ["Pagination", "PAGE_SIZE = 10, Prev/Next buttons, resets to page 1 on filter change via useEffect"],
              ["Inline status", "Select dropdown directly in the row calls updateTask"],
              ["Inline assign", "Unassigned tasks show an Assign button that opens a member picker"],
            ]}
          />
        </Sub>

        <Sub title="Backlog.jsx">
          <P>Shows tasks not assigned to any sprint. Filters by global <Code>searchQuery</Code>. Tasks can be dragged into sprints (visual only in this implementation).</P>
        </Sub>

        <Sub title="Timeline.jsx">
          <P>Gantt-style view of sprints and tasks plotted on a horizontal time axis. Calculates bar widths and offsets from <Code>startDate</Code>/<Code>endDate</Code> fields.</P>
        </Sub>

        <Sub title="Goals.jsx">
          <P>Each goal is a <Code>GoalCard</Code> with a range slider (<Code>{"<input type=\"range\">"}</Code>) for progress and a status <Code>{"<select>"}</Code>. Both call <Code>updateGoal(id, changes)</Code> on change. An <Code>AddGoalModal</Code> lets users create new goals.</P>
        </Sub>

        <Sub title="Sprints.jsx">
          <P>Sprint cards with inline status editing. Stats (total tasks, completed, in-progress) are computed live by filtering the tasks array. <Code>AddSprintModal</Code> creates new sprints via <Code>addSprint()</Code>.</P>
        </Sub>

        <Sub title="Reports.jsx">
          <P>Charts and metrics: velocity chart, burndown chart, status breakdown pie chart. All use Recharts. Tooltip styles use CSS variables for dark mode compatibility.</P>
        </Sub>

        <Sub title="Team.jsx">
          <P>Grid of team member cards showing name, role, avatar, and task counts. Data comes from the <Code>members</Code> array in <Code>useAppStore</Code>.</P>
        </Sub>

        <Sub title="Settings.jsx">
          <P>Tabbed settings page. The Appearance tab uses <Code>useThemeStore</Code> — the Light/Dark/System buttons actually call <Code>toggleDark()</Code> to change the real theme. Other tabs (Profile, Notifications) use <Code>useAuthStore</Code> for profile updates.</P>
        </Sub>

        <Sub title="About.jsx">
          <P>Static informational page about the TrackFlow project — tech stack credits, version info, and project description.</P>
        </Sub>
      </Section>

      {/* 9. Data Flow */}
      <Section title="9. Data Flow Diagram">
        <P>How data moves through the app:</P>
        <Block>{`User interaction (click, type, drag)
        ↓
Component calls store action
  e.g. updateTask(id, { status: "Done" })
        ↓
Zustand updates state (immutable merge)
        ↓
All subscribed components re-render
  e.g. Board columns, Task list, Dashboard KPIs
        ↓
UI reflects new state`}</Block>
        <P>The real app communicates with the backend API. UI events trigger store actions that call <Code>src/lib/api.js</Code>, send requests to the Express server, and update Zustand state after the server responds.</P>
      </Section>

      {/* 10. Search Architecture */}
      <Section title="10. Search Architecture">
        <P>Search has two layers:</P>
        <Table
          headers={["Layer", "Where", "How"]}
          rows={[
            ["Local dropdown", "Header.jsx, Sidebar.jsx", "Local useState — only shows a dropdown, does not affect other pages"],
            ["Global filter", "Tasks, Board, Backlog", "setSearchQuery() writes to store — all three pages read searchQuery and filter their lists"],
          ]}
        />
        <P>When the user presses Enter in the Header search or clicks a result in the Sidebar, the query is committed to the store and the user is navigated to <Code>/list</Code> where the global filter applies.</P>
      </Section>

      {/* 11. Auth Flow */}
      <Section title="11. Authentication Flow">
        <Block>{`User visits any route
        ↓
App.jsx checks isLoggedIn from useAuthStore
        ↓
  false → <Navigate to="/login" />
  true  → render AppShell with all routes
        ↓
Login page: user submits form
        ↓
login(email, password) called
  → 900ms simulated delay
  → match against demoUsers array
  → success: set isLoggedIn = true, currentUser = user
  → failure: set error message
        ↓
App.jsx re-renders → isLoggedIn is now true → AppShell renders`}</Block>
        <P>Demo credentials: <Code>sarah@trackflow.io / demo123</Code>, <Code>alex@trackflow.io / demo123</Code>, <Code>admin@trackflow.io / admin</Code></P>
      </Section>

      {/* 12. Dark Mode */}
      <Section title="12. Dark Mode Implementation">
        <P>Dark mode does NOT use Tailwind's built-in <Code>darkMode: 'class'</Code> config. Instead:</P>
        <Table
          headers={["Step", "Detail"]}
          rows={[
            ["1. Toggle", "toggleDark() in useThemeStore adds/removes .dark class on <html>"],
            ["2. CSS vars", ".dark block in style.css overrides all --bg-*, --text-*, --border vars"],
            ["3. Tailwind overrides", ".dark .bg-white { background: var(--bg-surface) } etc. in style.css"],
            ["4. Components", "Components use var(--bg-surface) inline styles or Tailwind classes that are overridden"],
          ]}
        />
        <P>This approach means dark mode works even for third-party components and inline styles, as long as they reference the CSS variables.</P>
      </Section>

      {/* 13. Key Patterns */}
      <Section title="13. Key React Patterns Used">
        <Table
          headers={["Pattern", "Where used", "Why"]}
          rows={[
            ["Custom hooks", "useIsDesktop, useAppStore, useAuthStore, useThemeStore", "Encapsulate reusable logic, keep components clean"],
            ["Controlled inputs", "All forms, filters, search bars", "React owns the value — single source of truth"],
            ["Derived state", "Sprints stats, filtered task lists", "Computed from store data on each render — no duplication"],
            ["useEffect cleanup", "useIsDesktop resize listener, Header keydown listener", "Prevents memory leaks when component unmounts"],
            ["Conditional rendering", "Sidebar overlay, dropdowns, modals", "Show/hide based on boolean state"],
            ["Component composition", "AppShell = Sidebar + Header + Routes", "Break complex UI into focused, reusable pieces"],
            ["Route guards", "LoginRoute, App route check", "Protect pages from unauthenticated access"],
          ]}
        />
      </Section>

      {/* 14. Terminal Commands */}
      <Section title="14. Terminal Commands — Full Reference">

        <Sub title="Project setup (run once)">
          <Table
            headers={["Command", "What it does", "When to run"]}
            rows={[
              ["npm install", "Reads package.json and downloads all dependencies into node_modules/", "After cloning the repo or after pulling changes that added new packages"],
              ["npm install <package>", "Installs a new runtime dependency and adds it to package.json dependencies", "When adding a new library e.g. npm install zustand"],
              ["npm install -D <package>", "Installs a dev-only dependency (build tools, linters)", "e.g. npm install -D eslint"],
            ]}
          />
        </Sub>

        <Sub title="Development">
          <Table
            headers={["Command", "What it does", "Notes"]}
            rows={[
              ["npm run dev", "Starts the Vite dev server with Hot Module Replacement (HMR)", "App available at http://localhost:5173 — changes reflect instantly without full reload"],
              ["npm run dev -- --port 3000", "Starts dev server on a custom port", "Useful if 5173 is already in use"],
              ["npm run dev -- --host", "Exposes dev server on your local network IP", "Lets other devices on the same Wi-Fi open the app"],
            ]}
          />
          <Block>{`# Start development
npm run dev

# Output you'll see:
#   VITE v8.x.x  ready in 300ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: use --host to expose`}</Block>
        </Sub>

        <Sub title="Linting">
          <Table
            headers={["Command", "What it does"]}
            rows={[
              ["npm run lint", "Runs ESLint across all .js/.jsx files — reports code quality issues"],
              ["npm run lint -- --fix", "Auto-fixes fixable ESLint issues (formatting, simple rules)"],
            ]}
          />
          <P>ESLint is configured in <Code>eslint.config.js</Code>. The project uses <Code>eslint-plugin-react-hooks</Code> (enforces hooks rules) and <Code>eslint-plugin-react-refresh</Code> (ensures components are safe for HMR).</P>
        </Sub>

        <Sub title="Building for production">
          <Table
            headers={["Command", "What it does", "Output"]}
            rows={[
              ["npm run build", "Bundles and minifies the entire app into the dist/ folder", "dist/index.html + dist/assets/*.js + dist/assets/*.css"],
              ["npm run preview", "Serves the dist/ folder locally to test the production build", "Available at http://localhost:4173"],
            ]}
          />
          <Block>{`# Build then preview
npm run build
npm run preview

# Build output example:
# dist/index.html                   0.46 kB
# dist/assets/index-Abc123.js     412.00 kB  (includes React + all libraries)
# dist/assets/index-Xyz789.css      8.20 kB`}</Block>
          <P>A chunk size warning appears for Recharts and dnd-kit — this is expected. The app still works fine. In a real production app you'd use <Code>React.lazy()</Code> + <Code>Suspense</Code> to split large chunks.</P>
        </Sub>

        <Sub title="Package management">
          <Table
            headers={["Command", "What it does"]}
            rows={[
              ["npm list", "Lists all installed top-level packages and their versions"],
              ["npm outdated", "Shows which packages have newer versions available"],
              ["npm update", "Updates all packages to their latest allowed version (respects semver ranges)"],
              ["npm uninstall <package>", "Removes a package from node_modules and package.json"],
              ["npm cache clean --force", "Clears npm's local cache — useful if installs are behaving strangely"],
            ]}
          />
        </Sub>

        <Sub title="Troubleshooting commands">
          <Table
            headers={["Problem", "Command to run", "Why it helps"]}
            rows={[
              ["node_modules corrupted / install errors", "rm -rf node_modules && npm install", "Deletes and fully reinstalls all dependencies from scratch"],
              ["Port 5173 already in use", "npm run dev -- --port 3000", "Uses a different port"],
              ["Build fails with type errors", "npm run lint", "Identifies the exact file and line causing the issue"],
              ["Changes not reflecting in browser", "Hard refresh: Ctrl+Shift+R", "Clears browser cache for the page"],
              ["Vite cache stale", "npx vite --force", "Forces Vite to re-bundle dependencies"],
            ]}
          />
        </Sub>

        <Sub title="Full workflow from scratch">
          <Block>{`# 1. Clone / navigate to project
cd trackflow

# 2. Install all dependencies
npm install

# 3. Start development server
npm run dev

# 4. (Optional) Check for lint issues
npm run lint

# 5. Build for production
npm run build

# 6. Preview production build
npm run preview`}</Block>
        </Sub>

        <Sub title="package.json scripts reference">
          <P>These are defined in <Code>package.json</Code> under the <Code>scripts</Code> key:</P>
          <Block>{`"scripts": {
  "dev":      "vite",          // runs: npx vite
  "build":    "vite build",    // runs: npx vite build
  "lint":     "eslint .",      // runs: npx eslint on all files
  "preview":  "vite preview",  // runs: npx vite preview
  "test":     "jest",          // runs unit tests
  "test:e2e": "playwright test" // runs E2E tests
}`}</Block>
          <P><Code>npm run &lt;name&gt;</Code> is just a shortcut — it runs whatever command is defined for that name in scripts. You could also run <Code>npx vite</Code> directly and get the same result as <Code>npm run dev</Code>.</P>
          <P>For the backend (<Code>server/package.json</Code>), scripts include <Code>"test": "jest"</Code> for API tests.</P>
        </Sub>

      </Section>

      {/* 16. Interview Prep */}
      <Section title="16. Interview Prep — TrackFlow">

        <Sub title="What is TrackFlow? (elevator pitch)">
          <P>TrackFlow is a full-stack agile project management tool built for software teams. It covers the full task and defect lifecycle — from backlog to deployment — with a Kanban board, sprint planning, goal tracking, team workload management, and real-time analytics. The frontend is React + Zustand, the backend is Node.js + Express + SQLite, and they communicate via a REST API secured with JWT.</P>
        </Sub>

        <Sub title="Full-Stack Architecture">
          <Table
            headers={["Layer", "Technology", "Why chosen"]}
            rows={[
              ["Frontend", "React 18 + Vite", "Fast HMR in dev, optimised production builds"],
              ["State", "Zustand", "No boilerplate, simpler than Redux for this scale"],
              ["Routing", "React Router v6", "Declarative client-side routing with route guards"],
              ["Drag & Drop", "@dnd-kit", "Accessible, modular, works without mouse events"],
              ["Charts", "Recharts", "Built on D3, composable React components"],
              ["Backend", "Node.js + Express 4", "Lightweight REST API, synchronous SQLite queries"],
              ["Database", "better-sqlite3", "File-based, zero config, synchronous API keeps code clean"],
              ["Auth", "JWT + bcryptjs", "Stateless auth, passwords hashed with bcrypt"],
              ["Proxy", "Vite proxy config", "Frontend /api calls forwarded to localhost:3001 — no CORS issues in dev"],
            ]}
          />
        </Sub>

        <Sub title="API Endpoints">
          <Table
            headers={["Method", "Route", "Description"]}
            rows={[
              ["POST",   "/api/auth/login",  "Login — returns JWT token + user object"],
              ["GET",    "/api/auth/me",     "Get current logged-in user from token"],
              ["GET",    "/api/tasks",       "Fetch all tasks (auth required)"],
              ["POST",   "/api/tasks",       "Create a new task"],
              ["PATCH",  "/api/tasks/:id",   "Update any field on a task"],
              ["DELETE", "/api/tasks/:id",   "Delete a task by id"],
              ["GET",    "/api/sprints",     "Fetch all sprints"],
              ["POST",   "/api/sprints",     "Create a new sprint"],
              ["PATCH",  "/api/sprints/:id", "Update sprint fields"],
              ["GET",    "/api/goals",       "Fetch all goals"],
              ["POST",   "/api/goals",       "Create a new goal"],
              ["PATCH",  "/api/goals/:id",   "Update goal progress/status"],
              ["GET",    "/api/members",     "Fetch all team members"],
            ]}
          />
        </Sub>

        <Sub title="Authentication Flow">
          <Block>{`1. User submits email + password on Login page
2. POST /api/auth/login → server checks bcrypt hash
3. Server returns { token, user } — JWT signed with 7 day expiry
4. Frontend stores token in localStorage as "tf_token"
5. Every API request sends: Authorization: Bearer <token>
6. Backend auth middleware verifies token on every protected route
7. If token missing/invalid → 401 Unauthorized
8. App.jsx checks isLoggedIn → redirects to /login if false`}</Block>
        </Sub>

        <Sub title="How drag and drop works (Kanban Board)">
          <P>The Board uses <Code>@dnd-kit</Code>. Each task card is wrapped in <Code>useSortable</Code> which gives it drag handles and transform styles. The whole board is wrapped in <Code>DndContext</Code>. On <Code>onDragEnd</Code>, the code checks if the drop target is a different column — if yes, it calls <Code>moveTask(id, newStatus)</Code> which hits <Code>PATCH /api/tasks/:id</Code> and updates the store. A <Code>DragOverlay</Code> renders a floating ghost card while dragging. <Code>PointerSensor</Code> with <Code>activationConstraint: distance 5</Code> prevents accidental drags on click.</P>
        </Sub>

        <Sub title="How state management works">
          <P><Code>useAppStore</Code> (Zustand) holds all data: tasks, members, sprints, goals, notifications, and UI state. On app mount, <Code>fetchAll()</Code> fires <Code>Promise.allSettled</Code> to load all 4 resources in parallel. Each action calls the API then updates the store. Filters and search are also stored here so they persist across page navigation.</P>
        </Sub>

        <Sub title="Common interview Q&A">
          <Table
            headers={["Question", "Answer"]}
            rows={[
              ["Why Zustand over Redux?", "No boilerplate — no actions, reducers, or dispatch. The store is just a function with state and setters. Cleaner and faster to write for this scale."],
              ["Why SQLite instead of PostgreSQL?", "File-based and zero config — perfect for a demo app. better-sqlite3 is synchronous so Express routes stay clean. For production I'd switch to PostgreSQL."],
              ["How is frontend connected to backend?", "Vite proxy config forwards all /api requests from localhost:5173 to localhost:3001. Avoids CORS issues in dev. In production you'd configure CORS or serve both from the same origin."],
              ["What does Promise.allSettled do in fetchAll?", "Fires all 4 API calls in parallel and waits for all to finish — even if some fail. Unlike Promise.all it doesn't short-circuit on the first error, so partial data still loads."],
              ["How does inline status change work?", "Each row has a select whose value is the task's current status. onChange calls updateTask(id, { status }) which PATCHes the backend and updates the store — no modal needed."],
              ["How does dark mode work?", "useThemeStore toggles a .dark class on html. style.css defines all colours as CSS variables on :root and overrides them under .dark. Tailwind classes like bg-white are also overridden in style.css."],
              ["How does real-time updates work?", "Socket.io server emits task events (created/updated/deleted) to connected clients. Frontend listens and updates Zustand state instantly, keeping all users in sync."],
              ["How is RBAC implemented?", "Users have roles stored in DB. Backend middleware checks roles for protected actions (e.g., delete requires admin). Frontend conditionally renders UI based on currentUser.role."],
              ["How do file uploads work?", "Multer handles multipart uploads to /api/tasks/:id/upload. Files saved to server/uploads/, filenames stored in task.attachments array. Served via /uploads/ static route."],
              ["How are emails sent?", "Nodemailer with Ethereal SMTP sends notifications on task assignment. Configured in server/index.js — in production, use a real provider like SendGrid."],
              ["What testing is included?", "Jest for unit tests (components, stores, API). Supertest for backend API tests. Playwright for E2E UI tests (login, create task, drag on board). CI runs all on GitHub Actions."],
              ["How does CI/CD work?", "GitHub Actions workflow installs deps, runs lint/test/build on pushes/PRs. Ensures code quality and automates deployment prep."],
              ["How are passwords stored?", "Hashed with bcryptjs (cost factor 10) before storing in SQLite. On login, bcrypt.compareSync checks the plain password against the hash — the plain password is never saved."],
              ["What would you improve in production?", "Add refresh token rotation for JWTs, implement 2FA, enhance error handling, add rate limiting, and deploy with Docker/Kubernetes for scalability."],
            ]}
          />
        </Sub>

        <Sub title="Demo credentials">
          <Table
            headers={["Role", "Email", "Password"]}
            rows={[
              ["Product Lead", "sarah@trackflow.io", "demo123"],
              ["Frontend Dev", "alex@trackflow.io",  "demo123"],
              ["Admin",        "admin@trackflow.io", "admin"],
            ]}
          />
        </Sub>

        <Sub title="Running the project">
          <Block>{`# Terminal 1 — Backend
cd server
npm run dev
# → TrackFlow API running on http://localhost:3001

# Terminal 2 — Frontend (root folder)
npm run dev
# → http://localhost:5173`}</Block>
        </Sub>

      </Section>

      {/* 15. Keeping the Manual Updated */}
      <Section title="15. Keeping This Manual Updated">
        <P>This manual is a living document. Every time a new feature, page, component, or store change is made to TrackFlow, the corresponding section in this file must be updated.</P>
        <Table
          headers={["Change type", "What to update in Manual.jsx"]}
          rows={[
            ["New page added", "Add a Sub entry under Section 8 (Pages) + add the route to the routes table in Section 4"],
            ["New store action", "Add a row to the actions table in Section 5 (Stores)"],
            ["New store state key", "Add a row to the state table in Section 5"],
            ["New component", "Add a Sub entry under Section 7 (Shared Components)"],
            ["New npm package installed", "Add a row to the tech stack table in Section 2"],
            ["New terminal command used", "Add it to the relevant sub-section in Section 14"],
            ["CSS variable added/changed", "Update the code block in Section 6 (Theming)"],
            ["Routing change", "Update the routes table in Section 4"],
          ]}
        />
        <P>File location: <Code>src/pages/Manual.jsx</Code>. Route: <Code>/manual</Code>. Sidebar link: bottom nav group under About.</P>
      </Section>

    </div>
  );
}
