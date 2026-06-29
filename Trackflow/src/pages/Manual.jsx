import { useMemo, useState } from "react";
import {
  BookOpen,
  Boxes,
  Brain,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  FileText,
  GitBranch,
  Layers,
  Lock,
  Network,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

const mono =
  "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

const sections = [
  "Project Overview",
  "Frontend Architecture",
  "State Management",
  "Authentication Flow",
  "API Layer",
  "Performance Optimizations",
  "Socket.IO / Real-time",
  "Kanban Board System",
  "Sprint System",
  "Search & Filter System",
  "Responsive Design",
  "Dark Mode System",
  "Database + Backend",
  "Complete Data Flow",
  "Interview Questions",
  "Implementation Details",
  "Interview Explanation",
  "UI Requirements",
  "Deep Technical Understanding",
  "Code Walkthrough",
  "Interview Traps",
  "Senior Engineering Thinking",
  "Deep React Questions",
  "Files To Study",
  "Complete Mental Model",
];

const architectureFlow = [
  "React UI",
  "Zustand Stores",
  "API Client",
  "Express Backend",
  "SQLite",
  "Socket.IO Events",
  "Subscribed UI Updates",
];

const importantFiles = [
  {
    file: "src/App.jsx",
    role: "Top-level routing, auth gate, AppShell layout, loading bar, lazy page routes.",
    study: "Protected routes, AppShell composition, useEffect bootstrap, responsive sidebar.",
  },
  {
    file: "src/store/useAppStore.js",
    role: "Global product data and UI state: tasks, members, sprints, goals, notifications, filters, modal state.",
    study: "Zustand set(), fetchAll(), socket listeners, immutable map/filter updates.",
  },
  {
    file: "src/store/useAuthStore.js",
    role: "Login, demo login, logout, current user, localStorage persistence, socket join.",
    study: "Token flow, session restore, auth invalidation, why auth belongs globally.",
  },
  {
    file: "src/lib/api.js",
    role: "Central API wrapper around fetch() with JSON headers, bearer token, and 401 handling.",
    study: "Separation of concerns, API error handling, CRUD functions.",
  },
  {
    file: "src/lib/socket.js",
    role: "Socket.IO client configuration and connection error logging.",
    study: "Explicit socket lifecycle and backend port alignment.",
  },
  {
    file: "src/pages/Board.jsx",
    role: "Kanban board, dnd-kit drag/drop, status columns, task movement.",
    study: "Derived state with useMemo, drag sensors, optimistic UI expectations.",
  },
  {
    file: "src/pages/Tasks.jsx",
    role: "Task table, filters, sorting, pagination, inline status editing.",
    study: "Filtering pipeline, controlled filters, memoized derived lists.",
  },
  {
    file: "src/components/TaskModal.jsx",
    role: "Create/edit task form controlled by global modal state and local form state.",
    study: "Local vs global state, controlled inputs, payload normalization.",
  },
  {
    file: "src/components/Header.jsx",
    role: "Top navigation, global search, keyboard shortcut, notifications, profile menu.",
    study: "Live dropdown slicing, Ctrl/Cmd+K, navigation after search.",
  },
  {
    file: "server/index.js",
    role: "Express API, JWT auth, SQLite schema/seed, CRUD endpoints, Socket.IO broadcasts.",
    study: "Backend responsibilities, token verification, parseTask(), emitTaskUpdate().",
  },
];

const optimizations = [
  {
    name: "Parallel bootstrap loading",
    purpose: "Load independent resources at the same time instead of one after another.",
    where: "src/store/useAppStore.js -> fetchAll()",
    technical:
      "fetchAll() calls api.getTasks(), api.getSprints(), api.getGoals(), api.getMembers(), and api.getNotifications() together inside Promise.allSettled().",
    interview:
      "I used allSettled because one failed resource should not block the whole app. Tasks can still render even if notifications fail.",
  },
  {
    name: "Centralized state management",
    purpose: "Avoid duplicating task, filter, modal, and notification state across unrelated pages.",
    where: "src/store/useAppStore.js",
    technical:
      "Pages read the same Zustand store instead of passing data through App -> Header -> Board -> TaskCard chains.",
    interview:
      "Shared server data belongs in a global store because several screens need the same source of truth.",
  },
  {
    name: "Immutable localized updates",
    purpose: "Update only the affected collection while keeping React state predictable.",
    where: "updateTask(), moveTask(), dismissNotif(), markAllRead() in useAppStore.js",
    technical:
      "map() replaces one matching task, filter() removes one item, and spread creates new arrays so subscribers see a new reference.",
    interview:
      "React and Zustand detect changes by references. Immutable updates make re-render behavior reliable.",
  },
  {
    name: "Memoized board derivations",
    purpose: "Avoid recalculating filtered board lists on every render.",
    where: "src/pages/Board.jsx -> boardTasks and tasksByStatus",
    technical:
      "useMemo derives visible tasks and status buckets from tasks/search query only when dependencies change.",
    interview:
      "Derived data should be recomputed when source data changes, not on unrelated local UI updates.",
  },
  {
    name: "Memoized task table derivations",
    purpose: "Keep filtering, sorting, pagination, and id lookups efficient.",
    where: "src/pages/Tasks.jsx -> filtered, paginated, memberById, sprintById",
    technical:
      "Tasks.jsx creates lookup Maps and memoized filtered slices before rendering table rows.",
    interview:
      "For repeated row rendering, lookup maps and memoized filtered data reduce repeated linear scans.",
  },
  {
    name: "Search result slicing",
    purpose: "Prevent dropdowns from rendering every matching task.",
    where: "src/components/Header.jsx and src/components/Sidebar.jsx",
    technical:
      "Header limits live results to six; Sidebar limits results to five after debounce.",
    interview:
      "Search should return enough items to help the user act quickly, not flood the DOM.",
  },
  {
    name: "Lazy route chunks",
    purpose: "Keep the initial app bundle smaller and load pages on demand.",
    where: "src/App.jsx -> React.lazy() and Suspense",
    technical:
      "Dashboard, Board, Tasks, Reports, Manual, and other pages are imported lazily.",
    interview:
      "Route-level code splitting delays heavy page code until the user navigates there.",
  },
  {
    name: "Conditional rendering",
    purpose: "Avoid rendering UI that is not visible or not relevant.",
    where: "TaskModal.jsx, NotificationPanel.jsx, Sidebar overlay, LoginRoute",
    technical:
      "Components return null when closed; protected shell renders only when authenticated.",
    interview:
      "Conditional rendering saves work and keeps app state aligned with visible UI.",
  },
  {
    name: "Global loading state",
    purpose: "Give one consistent loading signal for resource fetches.",
    where: "src/App.jsx -> LoadingBar, src/store/useAppStore.js -> loading object",
    technical:
      "LoadingBar checks Object.values(loading).some(Boolean) and renders a thin progress line.",
    interview:
      "Loading state is centralized because multiple pages depend on the same bootstrap data.",
  },
  {
    name: "Controlled forms",
    purpose: "Keep UI inputs and submitted payloads predictable.",
    where: "Login.jsx, TaskModal.jsx, Settings.jsx",
    technical:
      "Input values live in local useState and are normalized before API submission.",
    interview:
      "Controlled components make validation, reset, and payload construction easier.",
  },
  {
    name: "Responsive rendering",
    purpose: "Keep desktop and mobile layouts efficient and usable.",
    where: "src/App.jsx -> useIsDesktop(), Sidebar overlay",
    technical:
      "The sidebar is always visible on desktop and conditionally mounted/translated on mobile.",
    interview:
      "Responsive behavior is stateful where interaction matters, not only CSS breakpoints.",
  },
  {
    name: "Reusable UI components",
    purpose: "Reduce repeated implementation details and keep behavior consistent.",
    where: "Header, Sidebar, TaskModal, NotificationPanel, Logo, Manual doc components",
    technical:
      "Shared components encapsulate repeated UI decisions and receive only the props they need.",
    interview:
      "Reusable components improve consistency, testability, and long-term maintainability.",
  },
  {
    name: "Socket de-duplication",
    purpose: "Avoid duplicated tasks/notifications when socket events and local API updates both arrive.",
    where: "src/store/useAppStore.js -> taskCreated and notificationCreated listeners",
    technical:
      "Listeners check existing ids before prepending records.",
    interview:
      "Real-time clients must handle duplicate delivery gracefully because multiple update paths can race.",
  },
  {
    name: "Debounced sidebar search",
    purpose: "Avoid recalculating sidebar results on every keystroke immediately.",
    where: "src/components/Sidebar.jsx -> debouncedQ effect",
    technical:
      "A 180ms timeout delays updating the query used for result calculation.",
    interview:
      "Debounce reduces render churn for typeahead UI without making the app feel slow.",
  },
];

const interviewQuestions = [
  ["Why Zustand over Redux?", "Zustand gives a small global store without actions, reducers, dispatch, or provider setup. TrackFlow needs shared app data and UI state, but not Redux-level ceremony."],
  ["How does protected routing work?", "App.jsx reads useAuthStore().isLoggedIn. /login renders LoginRoute, while all other paths render AppShell only when authenticated; otherwise Navigate sends the user to /login."],
  ["What happens after login?", "Login.jsx calls useAuthStore.login(), api.login() sends credentials, the backend validates with bcrypt/JWT, the token and user are saved, AppShell renders, and fetchAll() loads app data."],
  ["Why localStorage?", "It is simple persistence for a demo/full-stack portfolio app. It survives refreshes, so the app can restore a session. The safer production choice is HTTP-only secure cookies."],
  ["What is Promise.allSettled?", "It runs promises concurrently and returns every result as fulfilled or rejected. Unlike Promise.all, one failure does not cancel access to the other successful results."],
  ["How does React re-render here?", "Components re-render when their local state changes, props change, or the Zustand snapshot they read changes. For example, Tasks re-renders when tasks or filters change."],
  ["Why immutable updates?", "New array/object references let React/Zustand know data changed. map() and filter() replace only affected records while preserving predictable state transitions."],
  ["How does fetchAll work?", "fetchAll sets loading flags, fires all resource requests, stores each fulfilled value independently, stores errors for failures, and leaves other successful data available."],
  ["How is CRUD structured?", "Components call store actions, store actions call api.js, api.js calls Express endpoints, Express updates SQLite, then the frontend updates Zustand state and subscribed components re-render."],
  ["How does Socket.IO differ from REST?", "REST is request/response. Socket.IO keeps a live connection so the backend can push task and notification events to clients immediately."],
  ["How does the Kanban board update?", "Board.jsx uses dnd-kit. On drag end, it determines the new status and calls moveTask(taskId, newStatus), which PATCHes the task and updates state."],
  ["Where are notifications generated?", "The backend creates notification records during task creation; the frontend also creates a local status notification in moveTask(). Socket events can broadcast notificationCreated."],
  ["How is search optimized?", "Header and Sidebar only show a small slice of results, Sidebar debounces input, and task pages memoize filtered lists."],
  ["What are current limitations?", "Search/filtering is client-side, localStorage has security tradeoffs, SQLite is demo-friendly but not horizontally scalable, and optimistic error rollback is limited."],
  ["How would you scale this?", "Move to PostgreSQL, add server-side pagination/search, use HTTP-only cookies, add query caching, add role-based UI policies, and partition real-time rooms by workspace/project."],
  ["What does centralized state buy you?", "The Board, Tasks, Header, Dashboard, and NotificationPanel can all react to the same task/notification state without manual synchronization."],
  ["How are controlled components used?", "Login and TaskModal inputs bind value to local state and update through onChange. This makes submit payloads deterministic."],
  ["What causes unnecessary re-renders?", "Reading too much global state in a component, recomputing large lists inline, or storing derived state unnecessarily can cause extra work."],
  ["How are errors handled?", "api.js throws errors for failed responses; auth 401s clear stale session data; fetchAll stores per-resource errors instead of failing the entire bootstrap."],
  ["Why separate api.js from components?", "Components stay focused on UI and intent. API details like URL, headers, token, and JSON parsing live in one place."],
  ["Why React.lazy?", "It splits page code into route chunks so heavy pages like Dashboard or Board do not all load on the first paint."],
  ["How is dark mode implemented?", "useThemeStore toggles a .dark class on documentElement, and style.css changes CSS variables under .dark."],
  ["What is a senior answer for this project?", "TrackFlow separates state ownership, routing, data access, and UI composition, with clear upgrade paths for production security, server-side search, and database scalability."],
];

const codeWalkthroughs = [
  {
    title: "1. User logs in",
    steps: [
      "Login.jsx owns email/password local state through useState.",
      "handleSubmit calls useAuthStore.login(email, password).",
      "useAuthStore.login calls api.login(), which POSTs /api/auth/login.",
      "server/index.js finds the user, validates bcrypt password, signs a JWT, and returns { token, user }.",
      "useAuthStore saves tf_token and tf_user in localStorage, sets isLoggedIn true, connects socket, and emits join.",
      "App.jsx re-renders and switches from /login to AppShell.",
    ],
  },
  {
    title: "2. App loads",
    steps: [
      "main.jsx renders App inside BrowserRouter.",
      "useAuthStore initializes currentUser from localStorage.",
      "App.jsx checks isLoggedIn and renders AppShell for protected routes.",
      "AppShell useEffect calls fetchAll().",
      "fetchAll concurrently requests tasks, sprints, goals, members, and notifications.",
      "Zustand stores fulfilled values; Header, Dashboard, Board, Tasks, and Manual scorecards can render from store data.",
    ],
  },
  {
    title: "3. User creates a task",
    steps: [
      "Header New Task or Board column plus calls openTaskModal().",
      "TaskModal renders because taskModalOpen is true.",
      "TaskModalForm keeps form fields in local state.",
      "Submit builds a normalized payload and calls addTask(payload).",
      "addTask calls api.createTask(), backend inserts into SQLite, creates a notification, emits taskCreated.",
      "Store prepends the created task; subscribed Board/Tasks/Dashboard components re-render.",
    ],
  },
  {
    title: "4. User edits a task",
    steps: [
      "Board card menu or Tasks edit button calls openTaskModal(task).",
      "TaskModalForm initializes from editingTask.",
      "Submit calls updateTask(editingTask.id, payload).",
      "api.updateTask PATCHes /api/tasks/:id.",
      "Backend merges updates, normalizes tags/attachments, updates SQLite, emits taskUpdated.",
      "Store replaces the matching task using map(); UI rows/cards show new values.",
    ],
  },
  {
    title: "5. User moves a Kanban card",
    steps: [
      "Board.jsx DndContext receives drag start and stores activeTask locally.",
      "DragOverlay renders a visual copy while dragging.",
      "handleDragEnd calculates the destination status.",
      "moveTask(taskId, newStatus) PATCHes backend and updates store.",
      "tasksByStatus useMemo recomputes buckets; the card appears in the new column.",
    ],
  },
  {
    title: "6. User searches tasks",
    steps: [
      "Header localQuery updates on input change.",
      "Header filters tasks and slices to six dropdown results.",
      "Selecting a result sets global searchQuery and navigates to /list.",
      "Tasks.jsx reads searchQuery and memoizes filtered rows.",
      "The task table renders matching results and shows a search pill.",
    ],
  },
  {
    title: "7. User opens modal",
    steps: [
      "Any component calls openTaskModal(optionalTask).",
      "useAppStore sets taskModalOpen true and editingTask.",
      "TaskModal is mounted once in AppShell but conditionally returns UI.",
      "Local form state is used only while the modal is open.",
      "closeTaskModal clears the global modal state.",
    ],
  },
  {
    title: "8. User logs out",
    steps: [
      "Header profile menu calls useAuthStore.logout().",
      "logout removes tf_token and tf_user from localStorage.",
      "Socket disconnects.",
      "isLoggedIn becomes false, App.jsx renders Navigate to /login.",
    ],
  },
  {
    title: "9. Socket connection initializes",
    steps: [
      "socket.js defines a Socket.IO client for localhost:3005 with autoConnect false.",
      "useAuthStore connects after login or when a saved user exists.",
      "The client emits join with user.id.",
      "Backend joins that socket to the user room and can broadcast events.",
    ],
  },
  {
    title: "10. Notification appears",
    steps: [
      "Backend inserts a notification during task creation.",
      "Backend emits notificationCreated.",
      "useAppStore socket listener prepends the notification if it is not duplicated.",
      "Header unread count recalculates from notifications.",
      "NotificationPanel renders the new item when opened.",
    ],
  },
];

const traps = [
  {
    trap: "Why not Redux?",
    avoid: "Do not say Redux is bad.",
    safe: "Redux is powerful, but for this app Zustand gives simpler shared state with less ceremony.",
    senior: "If the app needed strict event logs, middleware-heavy workflows, or enterprise debugging, Redux Toolkit would be a reasonable upgrade.",
  },
  {
    trap: "Why localStorage?",
    avoid: "Do not say it is fully secure.",
    safe: "It is simple persistence for this project.",
    senior: "For production, I would prefer secure HTTP-only SameSite cookies and short-lived access tokens to reduce XSS token theft risk.",
  },
  {
    trap: "What causes re-renders?",
    avoid: "Do not say every state change re-renders the whole app.",
    safe: "A component re-renders when its state, props, or subscribed Zustand slice changes.",
    senior: "Render scope depends on component boundaries and store subscription selection; reading broad state creates broader invalidation.",
  },
  {
    trap: "How does Socket.IO differ from polling?",
    avoid: "Do not say it is just faster fetch.",
    safe: "Socket.IO maintains a live connection so the backend can push events.",
    senior: "Socket.IO also provides fallbacks, reconnection, rooms, and event semantics; polling is client-initiated repeated request/response.",
  },
  {
    trap: "How would this handle large datasets?",
    avoid: "Do not claim current client-side filtering is enough forever.",
    safe: "Current filtering works for small/demo datasets.",
    senior: "At scale I would move filtering, sorting, pagination, and search indexing to the backend, then cache queries on the client.",
  },
  {
    trap: "What if an API fails?",
    avoid: "Do not say it never fails.",
    safe: "fetchAll uses allSettled so partial data can still load.",
    senior: "I would add retry/backoff, user-facing error states, optimistic rollback, and observability for production readiness.",
  },
];

const rankedFiles = [
  ["Critical", "src/App.jsx", "Routing, auth gate, AppShell, lazy loading, loading bar.", "Protected routes, composition, bootstrap lifecycle."],
  ["Critical", "src/store/useAppStore.js", "Main application state and actions.", "Zustand, fetchAll, socket listeners, immutable updates."],
  ["Critical", "src/store/useAuthStore.js", "Authentication and session persistence.", "Login/logout, token persistence, socket join."],
  ["Critical", "server/index.js", "Backend auth, database, CRUD, sockets.", "JWT, SQLite, Express endpoints, real-time events."],
  ["Important", "src/pages/Board.jsx", "Kanban movement and derived state.", "dnd-kit, useMemo, task lifecycle."],
  ["Important", "src/pages/Tasks.jsx", "Filtering, sorting, pagination.", "Efficient derived lists, controlled filter state."],
  ["Important", "src/components/TaskModal.jsx", "Create/edit workflow.", "Local form state vs global modal state."],
  ["Important", "src/components/Header.jsx", "Search, notifications, navigation.", "Keyboard shortcuts, dropdown optimization."],
  ["Important", "src/lib/api.js", "All frontend/backend communication.", "Fetch abstraction, token headers, 401 handling."],
  ["Optional", "src/pages/Dashboard.jsx", "Analytics presentation.", "Derived metrics, Recharts, visual summaries."],
  ["Optional", "src/style.css", "Theme tokens and responsive utilities.", "CSS variables, dark mode overrides."],
];

function Card({ children, accent = "#6366f1", style = {} }) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        padding: 18,
        boxShadow: "var(--shadow-sm)",
        borderTop: `3px solid ${accent}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Section({ id, title, icon, children }) {
  const Icon = icon || FileText;
  return (
    <section id={id} style={{ scrollMarginTop: 88, marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.25)",
            color: "#6366f1",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={18} />
        </span>
        <h2 style={{ margin: 0, color: "var(--text-primary)", fontSize: 22, fontWeight: 850 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function H3({ children }) {
  return <h3 style={{ margin: "0 0 8px", color: "var(--text-primary)", fontSize: 16, fontWeight: 800 }}>{children}</h3>;
}

function P({ children }) {
  return <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", lineHeight: 1.75, fontSize: 14 }}>{children}</p>;
}

function Code({ children }) {
  return (
    <code
      style={{
        fontFamily: mono,
        fontSize: 12,
        color: "var(--text-primary)",
        background: "var(--bg-surface2)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 6,
        padding: "2px 6px",
        whiteSpace: "pre-wrap",
      }}
    >
      {children}
    </code>
  );
}

function Pre({ children }) {
  return (
    <pre
      style={{
        fontFamily: mono,
        fontSize: 12,
        lineHeight: 1.65,
        color: "var(--text-primary)",
        background: "var(--bg-surface2)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        padding: 14,
        overflowX: "auto",
        margin: "10px 0",
      }}
    >
      {children}
    </pre>
  );
}

function Pill({ children, color = "#6366f1" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        padding: "4px 9px",
        fontSize: 12,
        fontWeight: 700,
        color,
        background: `${color}18`,
        border: `1px solid ${color}35`,
      }}
    >
      {children}
    </span>
  );
}

function Flow({ items }) {
  return (
    <div style={{ display: "grid", gap: 8, margin: "12px 0" }}>
      {items.map((item, index) => (
        <div key={`${item}-${index}`} style={{ display: "grid", gap: 8 }}>
          <div
            style={{
              background: "var(--bg-surface2)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 8,
              padding: "10px 12px",
              color: "var(--text-primary)",
              fontWeight: 750,
            }}
          >
            {item}
          </div>
          {index < items.length - 1 && (
            <div style={{ color: "var(--text-muted)", fontWeight: 900, paddingLeft: 14 }}>v</div>
          )}
        </div>
      ))}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--border-subtle)", borderRadius: 8, marginTop: 10 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--bg-surface2)" }}>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "var(--text-primary)", fontWeight: 800, whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 12px", color: "var(--text-secondary)", verticalAlign: "top", lineHeight: 1.55 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden", background: "var(--bg-surface)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "12px 14px",
          background: "var(--bg-surface2)",
          border: 0,
          cursor: "pointer",
          color: "var(--text-primary)",
          fontWeight: 800,
          textAlign: "left",
        }}
      >
        {title}
        {open ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
      </button>
      {open && <div style={{ padding: 14 }}>{children}</div>}
    </div>
  );
}

function OptimizationCard({ item }) {
  return (
    <Card accent="#14b8a6">
      <H3>{item.name}</H3>
      <P><strong>Purpose:</strong> {item.purpose}</P>
      <P><strong>Where implemented:</strong> <Code>{item.where}</Code></P>
      <P><strong>Technical explanation:</strong> {item.technical}</P>
      <P><strong>Interview answer:</strong> {item.interview}</P>
    </Card>
  );
}

function QAList({ items }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map(([q, a], index) => (
        <Accordion key={q} title={`${index + 1}. ${q}`} defaultOpen={index < 3}>
          <P>{a}</P>
        </Accordion>
      ))}
    </div>
  );
}

function StudyCard({ file }) {
  return (
    <Card accent="#8b5cf6">
      <H3><Code>{file.file}</Code></H3>
      <P><strong>Why it matters:</strong> {file.role}</P>
      <P><strong>What to focus on:</strong> {file.study}</P>
    </Card>
  );
}

function Concept({ name, beginner, engineering, implementation, why, interview }) {
  return (
    <Accordion title={name}>
      <P><strong>Beginner meaning:</strong> {beginner}</P>
      <P><strong>Engineering meaning:</strong> {engineering}</P>
      <P><strong>TrackFlow implementation:</strong> {implementation}</P>
      <P><strong>Why this way:</strong> {why}</P>
      <P><strong>Interview answer:</strong> {interview}</P>
    </Accordion>
  );
}

export default function Manual() {
  const sectionIds = useMemo(
    () => sections.map((title, index) => ({ title, id: `manual-${index + 1}` })),
    []
  );

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "4px 0 64px" }}>
      <div
        style={{
          border: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
          borderRadius: 8,
          padding: 24,
          marginBottom: 18,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <Pill color="#6366f1">Internal engineering documentation</Pill>
          <Pill color="#10b981">Interview preparation</Pill>
          <Pill color="#f59e0b">Architecture handbook</Pill>
        </div>
        <h1 style={{ margin: "0 0 10px", fontSize: 32, lineHeight: 1.1, fontWeight: 950, color: "var(--text-primary)" }}>
          TrackFlow Technical Manual
        </h1>
        <P>
          This page is a deep internal guide for explaining TrackFlow in interviews. It covers the frontend, backend, state model,
          data flow, real-time system, performance choices, security tradeoffs, and the senior engineering reasoning behind the project.
        </P>
        <Flow items={architectureFlow} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 260px) minmax(0, 1fr)", gap: 18 }} className="manual-layout">
        <aside style={{ alignSelf: "start" }} className="manual-toc">
          <Card accent="#6366f1">
            <H3>Contents</H3>
            <div style={{ display: "grid", gap: 4 }}>
              {sectionIds.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: 12,
                    lineHeight: 1.35,
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: "var(--bg-surface2)",
                  }}
                >
                  {index + 1}. {item.title}
                </a>
              ))}
            </div>
          </Card>
        </aside>

        <main>
          <Section id="manual-1" title="1. Project Overview" icon={BookOpen}>
            <Card>
              <P>
                TrackFlow is a Jira-inspired agile project management app. It gives a software team a single workspace for
                authentication, tasks, backlog, Kanban movement, sprint planning, goals, dashboard analytics, notifications,
                search, filtering, responsive layout, dark mode, and real-time synchronization.
              </P>
              <P>
                The problem it solves is coordination. Instead of task state being scattered across messages, spreadsheets, and
                status meetings, TrackFlow centralizes task ownership, status, priority, sprint assignment, and team visibility.
              </P>
              <P>
                It was built as a full-stack learning and portfolio project, but its architecture mirrors real product systems:
                a React client, global client state, API abstraction, authenticated Node backend, SQLite persistence, and Socket.IO events.
              </P>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginTop: 12 }}>
              {["Authentication", "Protected routes", "Kanban board", "Sprint management", "Task CRUD", "Dashboard analytics", "Notifications", "Real-time updates", "Search and filters", "Dark mode"].map((feature) => (
                <Card key={feature} accent="#6366f1" style={{ padding: 14 }}>
                  <strong style={{ color: "var(--text-primary)" }}>{feature}</strong>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="manual-2" title="2. Frontend Architecture" icon={Layers}>
            <Card>
              <H3>Folder Strategy</H3>
              <Pre>{`src/
  components/   shared UI: Header, Sidebar, TaskModal, NotificationPanel
  pages/        route-level screens: Board, Tasks, Dashboard, Login, Manual
  store/        Zustand stores for auth, app data, and theme
  lib/          infrastructure helpers: api.js and socket.js
  App.jsx       routing, layout shell, auth gating, loading bar
  style.css     CSS variables, dark mode, utility overrides`}</Pre>
              <P>
                The separation keeps ownership clear. Pages describe full screens, components handle reusable UI, stores own shared
                state, and lib files hide infrastructure details like HTTP and sockets.
              </P>
            </Card>
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {importantFiles.slice(0, 9).map((file) => <StudyCard key={file.file} file={file} />)}
            </div>
          </Section>

          <Section id="manual-3" title="3. State Management (Zustand)" icon={Boxes}>
            <Card>
              <H3>Why Zustand</H3>
              <P>
                Zustand was chosen because TrackFlow needs shared state without Redux boilerplate. Stores are plain hooks, actions live
                beside the state they update, and components can subscribe directly to the data they need.
              </P>
              <Flow items={["User action", "Store action executes", "set() creates new state", "Subscribers receive new snapshot", "React re-renders affected UI"]} />
              <Pre>{`set((state) => ({
  tasks: state.tasks.map((task) =>
    task.id === id ? updatedTask : task
  )
}));`}</Pre>
              <P>
                <Code>set()</Code> is Zustand's state update function. When it receives a new object or a function returning a new
                object, Zustand updates the store and notifies components that read affected state.
              </P>
            </Card>
            <Table
              headers={["State Area", "Where", "What it controls"]}
              rows={[
                ["Auth state", "useAuthStore.js", "isLoggedIn, currentUser, loginError, loading, token persistence."],
                ["Task state", "useAppStore.js", "tasks plus add/update/delete/move actions."],
                ["Filter state", "useAppStore.js", "searchQuery, filterStatus, filterPriority, filterType."],
                ["Notification state", "useAppStore.js", "notifications, panel visibility, mark read, dismiss."],
                ["Modal state", "useAppStore.js", "taskModalOpen and editingTask."],
                ["Theme state", "useThemeStore.js", "dark boolean and documentElement .dark class."],
              ]}
            />
          </Section>

          <Section id="manual-4" title="4. Authentication Flow" icon={Lock}>
            <Card>
              <Flow items={["Login.jsx form submit", "api.login() POST /api/auth/login", "Express validates email/password", "JWT token returned", "tf_token and tf_user stored", "App.jsx unlocks AppShell", "Socket joins current user"]} />
              <P>
                A token is a signed proof that the backend recognized the user. TrackFlow uses JWT. The frontend sends it as
                <Code>Authorization: Bearer token</Code> on protected API calls.
              </P>
              <P>
                localStorage is used because it is simple and survives refreshes. Security caveat: JavaScript can read localStorage,
                so XSS could steal tokens. Production apps commonly use secure HTTP-only SameSite cookies instead.
              </P>
              <P>
                Logout removes <Code>tf_token</Code> and <Code>tf_user</Code>, disconnects the socket, and flips <Code>isLoggedIn</Code>
                to false so App.jsx redirects back to login.
              </P>
            </Card>
            <QAList items={[
              ["Why token-based auth?", "It makes the backend stateless: each request carries proof of identity. The server verifies the token instead of storing a session in memory."],
              ["Why are protected routes on the frontend not enough?", "Frontend protection is UX only. The backend must still verify JWTs because users can call APIs directly."],
              ["What is the production security improvement?", "Move tokens into secure HTTP-only cookies, use HTTPS, add CSRF protections where needed, rotate/expire tokens, and sanitize all user-generated content."],
            ]} />
          </Section>

          <Section id="manual-5" title="5. API Layer" icon={Network}>
            <Card>
              <P>
                <Code>src/lib/api.js</Code> centralizes frontend/backend communication. Components do not manually build URLs,
                headers, JSON parsing, or token logic. They call semantic functions like <Code>getTasks()</Code> or
                <Code>updateTask()</Code>.
              </P>
              <Pre>{`Component -> Zustand action -> api.js function -> Express endpoint -> SQLite -> JSON response -> Zustand update -> UI render`}</Pre>
            </Card>
            <Table
              headers={["Function", "Purpose", "Flow"]}
              rows={[
                ["getTasks()", "Read all tasks", "GET /api/tasks, backend parses tags/attachments, store receives array."],
                ["createTask(task)", "Create a task", "POST /api/tasks, backend inserts SQLite row, emits taskCreated."],
                ["updateTask(id, updates)", "Patch task fields", "PATCH /api/tasks/:id, backend merges updates and emits taskUpdated."],
                ["deleteTask(id)", "Delete task", "DELETE /api/tasks/:id, backend deletes and emits taskDeleted."],
                ["fetchAll()", "Bootstrap data", "Runs multiple API functions concurrently with Promise.allSettled()."],
              ]}
            />
          </Section>

          <Section id="manual-6" title="6. Performance Optimizations" icon={Zap}>
            <div style={{ display: "grid", gap: 12 }}>
              {optimizations.map((item) => <OptimizationCard key={item.name} item={item} />)}
            </div>
          </Section>

          <Section id="manual-7" title="7. Socket.IO / Real-time System" icon={Sparkles}>
            <Card>
              <P>
                REST is request/response: the browser asks and the server answers. Socket.IO is event-based: after a connection
                exists, the server can push task and notification changes to the browser without waiting for another HTTP request.
              </P>
              <Flow items={["Frontend connects after login", "socket.emit('join', user.id)", "Backend receives join and stores socket in a room", "Task endpoint emits taskCreated/taskUpdated/taskDeleted", "useAppStore socket listener updates Zustand", "Subscribed UI updates live"]} />
              <P>
                TrackFlow uses sockets for live task and notification synchronization. The current implementation broadcasts broadly
                with <Code>io.emit</Code> for task updates and also supports joining a user room for presence-oriented flows.
              </P>
            </Card>
          </Section>

          <Section id="manual-8" title="8. Kanban Board System" icon={GitBranch}>
            <Card>
              <P>
                Kanban visualizes work by status. TrackFlow's board uses columns for <Code>todo</Code>, <Code>in-progress</Code>,
                <Code>review</Code>, and <Code>done</Code>. Backlog tasks are excluded from the board.
              </P>
              <P>
                <Code>Board.jsx</Code> uses dnd-kit with <Code>DndContext</Code>, <Code>PointerSensor</Code>, <Code>SortableContext</Code>,
                and <Code>DragOverlay</Code>. When dragging ends, <Code>handleDragEnd</Code> calculates the destination status and calls
                <Code>moveTask(active.id, newStatus)</Code>.
              </P>
              <Flow items={["Task card dragged", "handleDragStart sets activeTask", "DragOverlay shows preview", "handleDragEnd finds target column", "moveTask PATCHes backend", "tasksByStatus recomputes", "Card renders in new column"]} />
            </Card>
          </Section>

          <Section id="manual-9" title="9. Sprint System" icon={Rocket}>
            <Card>
              <P>
                An agile sprint is a time-boxed work cycle. In TrackFlow, sprints are records with id, name, goal, start/end dates,
                status, and story points. Tasks relate to sprints through <Code>sprintId</Code>.
              </P>
              <P>
                Sprint planning means deciding which tasks belong in the sprint. Sprint tracking means measuring task completion,
                story points, and active work against the sprint goal.
              </P>
              <P>
                The frontend stores sprints in <Code>useAppStore.sprints</Code>, the modal can assign a task to a sprint, and dashboard
                analytics can compute sprint progress from tasks with matching <Code>sprintId</Code>.
              </P>
            </Card>
          </Section>

          <Section id="manual-10" title="10. Search & Filter System" icon={Search}>
            <Card>
              <P>
                Search exists globally and locally. Header search stores selected/global results in <Code>searchQuery</Code>. Board also
                has <Code>localFilter</Code> for card filtering. Tasks.jsx applies <Code>searchQuery</Code>, <Code>filterStatus</Code>,
                <Code>filterPriority</Code>, and <Code>filterType</Code>.
              </P>
              <P>
                Ctrl/Cmd+K focuses the Header search input. Header live results filter tasks and slice to six. Sidebar search debounces
                the query and slices to five. This keeps dropdown rendering small and responsive.
              </P>
              <Flow items={["User types", "Local query updates", "Dropdown derives matching tasks", "User selects result", "setSearchQuery(task.id)", "navigate('/list')", "Tasks.jsx filters rows"]} />
            </Card>
          </Section>

          <Section id="manual-11" title="11. Responsive Design" icon={Layers}>
            <Card>
              <P>
                <Code>useIsDesktop()</Code> in App.jsx tracks whether <Code>window.innerWidth &gt;= 1024</Code>. Desktop always shows the
                sidebar. Mobile stores <Code>sidebarOpen</Code> and conditionally renders an overlay plus a translated sidebar panel.
              </P>
              <P>
                This combines CSS responsiveness with React state. CSS handles layout constraints, while React controls interactive
                mobile behavior like opening and closing the sidebar.
              </P>
            </Card>
          </Section>

          <Section id="manual-12" title="12. Dark Mode System" icon={ShieldCheck}>
            <Card>
              <P>
                <Code>useThemeStore.js</Code> stores a <Code>dark</Code> boolean and toggles <Code>document.documentElement.classList</Code>.
                <Code>style.css</Code> defines light values in <Code>:root</Code> and dark overrides in <Code>.dark</Code>.
              </P>
              <P>
                Components reference CSS variables such as <Code>var(--bg-surface)</Code>, <Code>var(--text-primary)</Code>, and
                <Code>var(--border-subtle)</Code>. That keeps component styles theme-compatible without duplicating logic.
              </P>
            </Card>
          </Section>

          <Section id="manual-13" title="13. Database + Backend" icon={Database}>
            <Card>
              <P>
                The backend in <Code>server/index.js</Code> is responsible for authentication, authorization, validation-ish payload
                handling, SQLite reads/writes, notification creation, file uploads, email attempts, and Socket.IO broadcasting.
              </P>
              <P>
                SQLite was chosen because it is simple, local, and excellent for demos or single-node apps. A production multi-user
                deployment would usually move to PostgreSQL or another server database.
              </P>
            </Card>
            <Table
              headers={["Backend Concern", "Implementation"]}
              rows={[
                ["Schema", "CREATE TABLE IF NOT EXISTS users, members, tasks, sprints, goals, notifications."],
                ["Auth", "JWT signed after bcrypt password validation; auth middleware verifies bearer token."],
                ["CRUD", "Express routes for tasks, sprints, goals, members, notifications."],
                ["Real-time", "Socket.IO server emits task and notification events."],
                ["Parsing", "parseTask() converts comma strings into arrays for tags/attachments."],
              ]}
            />
          </Section>

          <Section id="manual-14" title="14. Complete Data Flow" icon={Workflow}>
            <Card>
              <Flow items={["User logs in", "Token stored in localStorage", "AppShell renders", "fetchAll() runs", "API requests include bearer token", "Backend validates token", "SQLite rows returned", "Zustand store updates", "React components render", "User performs CRUD", "Store and backend update", "Socket broadcasts events", "Other clients update live"]} />
            </Card>
          </Section>

          <Section id="manual-15" title="15. Technical Interview Questions" icon={Brain}>
            <QAList items={interviewQuestions} />
          </Section>

          <Section id="manual-16" title="16. Important Implementation Details" icon={Code2}>
            <Table
              headers={["Question", "Exact implementation"]}
              rows={[
                ["Where are notifications generated?", "server/index.js creates one during task creation; useAppStore.moveTask creates local status notification."],
                ["Where are loading states handled?", "useAppStore.loading object; App.jsx LoadingBar reads it."],
                ["Where are filters applied?", "Tasks.jsx filtered useMemo; Board.jsx boardTasks useMemo."],
                ["Where is auth state stored?", "useAuthStore plus localStorage keys tf_token and tf_user."],
                ["Where is routing protected?", "App.jsx LoginRoute and wildcard protected AppShell route."],
                ["Where is socket initialized?", "src/lib/socket.js; connected in useAuthStore after saved user/login."],
                ["Where do API calls happen?", "src/lib/api.js functions, called by store actions."],
                ["Where is search implemented?", "Header.jsx, Sidebar.jsx, Board.jsx localFilter, Tasks.jsx filters."],
                ["Where are modals controlled?", "useAppStore taskModalOpen/editingTask; TaskModal mounted in AppShell."],
              ]}
            />
          </Section>

          <Section id="manual-17" title="17. How To Explain This Project In Interview" icon={FileText}>
            <div style={{ display: "grid", gap: 12 }}>
              <Card accent="#10b981">
                <H3>30-second explanation</H3>
                <P>TrackFlow is a Jira-inspired full-stack project management app with React, Zustand, Express, SQLite, JWT auth, and Socket.IO real-time updates.</P>
              </Card>
              <Card accent="#10b981">
                <H3>1-minute explanation</H3>
                <P>Users authenticate, protected routes render the app shell, fetchAll loads tasks/sprints/goals/members/notifications into Zustand, and pages like Board, Tasks, and Dashboard subscribe to that shared state. CRUD actions go through an API abstraction to Express/SQLite, and Socket.IO keeps clients synchronized.</P>
              </Card>
              <Card accent="#10b981">
                <H3>Detailed technical explanation</H3>
                <P>The project separates route screens, shared components, global stores, and infrastructure helpers. Zustand centralizes server state and UI state. App.jsx gates routes and bootstraps data. api.js owns HTTP details. server/index.js owns auth, persistence, and sockets. This separation makes each piece easier to test, explain, and scale.</P>
              </Card>
              <Card accent="#10b981">
                <H3>Senior frontend explanation</H3>
                <P>TrackFlow demonstrates state ownership, derived rendering, route-level splitting, controlled forms, real-time synchronization, and clear boundaries. The main tradeoffs are demo-friendly localStorage/SQLite/client-side search versus production-grade cookies/PostgreSQL/server-side querying.</P>
              </Card>
            </div>
          </Section>

          <Section id="manual-18" title="18. UI Requirements" icon={Sparkles}>
            <Card>
              <P>
                This Manual page is intentionally documentation-like rather than product-marketing-like. It uses compact cards,
                accordions, tables, code blocks, and text diagrams so the page can be scanned during study and read deeply during
                interview preparation.
              </P>
              <P>
                The design is dark-theme compatible because it uses TrackFlow CSS variables such as <Code>var(--bg-surface)</Code>,
                <Code>var(--text-primary)</Code>, <Code>var(--text-secondary)</Code>, and <Code>var(--border-subtle)</Code>.
              </P>
              <P>
                The collapsible interview and walkthrough sections keep dense material manageable. Tables are used where comparison
                matters, flows are used where sequence matters, and cards are used where each concept should stand independently.
              </P>
            </Card>
          </Section>

          <Section id="manual-19" title="19. Deep Technical Understanding" icon={Brain}>
            <div style={{ display: "grid", gap: 10 }}>
              <Concept
                name="React re-rendering in TrackFlow"
                beginner="A component updates when the data it uses changes."
                engineering="React calls the component function again, compares the resulting element tree, and commits the minimal DOM changes."
                implementation="Board re-renders when tasks change; Header re-renders when notifications change; TaskModal re-renders when local form state changes."
                why="This keeps UI declarative: render output is a function of current state."
                interview="I think in terms of state ownership and subscriptions. Local state updates only local UI; Zustand updates shared UI."
              />
              <Concept
                name="Zustand subscriptions"
                beginner="Components subscribe to the store by calling the store hook."
                engineering="The hook reads a snapshot of store state and React re-renders when the selected snapshot changes."
                implementation="useAppStore is used by Board, Tasks, Header, TaskModal, Dashboard, and NotificationPanel."
                why="Multiple unrelated pages need the same task and notification data."
                interview="Zustand avoids prop drilling while preserving simple action functions and immutable updates."
              />
              <Concept
                name="Local state vs global state"
                beginner="Local state is for one component; global state is shared."
                engineering="Local state reduces global invalidation, while global state coordinates cross-route behavior."
                implementation="TaskModal form fields use useState; taskModalOpen and tasks live in Zustand."
                why="Form typing should not update the whole app, but opening a modal from Header/Board/Tasks requires global control."
                interview="I keep ephemeral UI details local and shared domain state global."
              />
              <Concept
                name="React Router rendering"
                beginner="The URL decides which page component renders."
                engineering="Routes match location and render the matching element inside the current routing tree."
                implementation="App.jsx maps /board to Board, /list to Tasks, /manual to Manual, and protects non-login routes."
                why="Route-level pages make navigation and code splitting easy."
                interview="React Router gives SPA navigation while App.jsx centralizes auth boundaries."
              />
              <Concept
                name="Async startup with fetchAll()"
                beginner="The app loads data after the shell appears."
                engineering="An effect calls async store action fetchAll, which updates loading state and resolves independent requests."
                implementation="AppShell useEffect calls fetchAll; LoadingBar reads store loading values."
                why="The shell can render once, then data arrives and subscribed pages update."
                interview="Bootstrap data is parallelized and failure-tolerant with Promise.allSettled."
              />
              <Concept
                name="Immutable map/filter updates"
                beginner="Instead of changing an array directly, make a new array."
                engineering="New references let subscription and reconciliation systems detect changes predictably."
                implementation="updateTask uses map; deleteTask and dismissNotif use filter."
                why="Mutating arrays in place can cause stale UI because references stay the same."
                interview="Immutability is the foundation of predictable React rendering."
              />
              <Concept
                name="Socket.IO connection lifecycle"
                beginner="The app connects to a live server after login."
                engineering="A persistent event channel is opened and closed based on auth state."
                implementation="socket.js sets autoConnect false; useAuthStore connects after login/current user and disconnects on logout/401."
                why="Unauthenticated users should not start unnecessary socket polling."
                interview="I tie socket lifecycle to auth lifecycle to reduce noise and avoid unauthorized real-time connections."
              />
              <Concept
                name="Event handlers"
                beginner="Event handlers are functions that run when the user clicks, types, submits, or drags."
                engineering="Handlers translate browser events into state transitions or side effects."
                implementation="Login handleSubmit calls login(); TaskModal handleSubmit builds payloads; Board handleDragEnd calls moveTask()."
                why="Keeping event handlers close to the UI makes the interaction easy to trace."
                interview="I treat handlers as the boundary between user intent and application state changes."
              />
              <Concept
                name="Async state updates"
                beginner="Some actions wait for the server before updating the UI."
                engineering="Async store actions await API calls, then commit state changes through set()."
                implementation="addTask, updateTask, deleteTask, moveTask, addSprint, updateSprint, addGoal, and updateGoal call api.js before updating Zustand."
                why="The backend remains the source of persisted truth while the frontend stays synchronized."
                interview="Async updates are isolated in store actions so components do not need to know transport details."
              />
              <Concept
                name="Notifications propagation"
                beginner="A notification is added, then the header count and notification panel update."
                engineering="The notifications array is global state; any subscriber renders the new snapshot."
                implementation="server/index.js creates notification rows, useAppStore listens for notificationCreated, Header computes unread count, NotificationPanel maps notifications."
                why="Notifications affect multiple UI regions, so they belong in shared state."
                interview="The notification flow demonstrates backend event generation, socket delivery, store update, and subscribed UI render."
              />
              <Concept
                name="Dynamic search rendering"
                beginner="Search results update as the user types."
                engineering="Input state drives derived filtered arrays; React renders the matching result list."
                implementation="Header localQuery filters tasks and slices to six; Sidebar debounces q into debouncedQ and slices to five."
                why="Local state keeps typing responsive; slicing prevents large dropdowns."
                interview="The search dropdown is derived UI, not stored server data."
              />
              <Concept
                name="Filter state changes"
                beginner="Changing a filter changes which tasks are visible."
                engineering="Global filter state updates cause Tasks.jsx filtered useMemo to recompute and render a new row set."
                implementation="searchQuery, filterStatus, filterPriority, and filterType live in useAppStore and are applied in Tasks.jsx."
                why="Filters are global because Header/Sidebar can set search and Tasks consumes it."
                interview="This is a clean example of shared state driving derived UI."
              />
              <Concept
                name="Global modal state"
                beginner="Any page can open the same task modal."
                engineering="Global state stores modal visibility and edit target; local state stores temporary form values."
                implementation="openTaskModal(task) sets taskModalOpen and editingTask; TaskModal is mounted in AppShell and returns null when closed."
                why="A globally mounted modal avoids duplicating create/edit forms across pages."
                interview="The modal is globally controlled, but the form remains locally controlled to avoid unnecessary app-wide updates while typing."
              />
              <Concept
                name="Loading state propagation"
                beginner="The app shows a loading bar when data is loading."
                engineering="Resource-specific loading flags are aggregated into one shell-level indicator."
                implementation="fetchAll sets loading.tasks/sprints/goals/members; LoadingBar in App.jsx checks Object.values(loading).some(Boolean)."
                why="Users get a consistent signal without each page inventing its own loading UI."
                interview="Central loading state makes bootstrapping observable at the shell level."
              />
              <Concept
                name="Promise.allSettled internals"
                beginner="It waits for all requests whether they pass or fail."
                engineering="Each promise resolves into a result object with status fulfilled or rejected."
                implementation="fetchAll destructures task/sprint/goal/member/notification results and handles each independently."
                why="The app can render partial data when one endpoint fails."
                interview="I chose allSettled over all to avoid one failed resource blanking the whole app."
              />
              <Concept
                name="Task movement and board synchronization"
                beginner="Dragging a card changes its status."
                engineering="Drag/drop computes intent locally, persists it through the API, then updates normalized UI state."
                implementation="Board handleDragEnd calls moveTask; moveTask PATCHes /api/tasks/:id and replaces the task in state."
                why="The board is just a visual projection of task.status."
                interview="Kanban columns are derived from task status, so moving a card is a status update, not a separate board data model."
              />
              <Concept
                name="Backend response to UI state"
                beginner="The server sends data back and the UI shows it."
                engineering="API responses are normalized enough for frontend state and then committed through store actions."
                implementation="parseTask turns tags/attachments into arrays; api.js returns JSON; useAppStore stores returned tasks/sprints/goals."
                why="The frontend should not guess whether a backend write succeeded."
                interview="The store updates from backend responses so UI state matches persisted state."
              />
              <Concept
                name="Session restore after refresh"
                beginner="Refreshing does not always log the user out."
                engineering="Auth store initializes from localStorage at module load, then App.jsx chooses Login or AppShell."
                implementation="useAuthStore reads tf_user and tf_token; if currentUser exists, socket connects and emits join."
                why="Persistence makes the app usable across page reloads."
                interview="Session restoration is localStorage-backed here, with a production path toward secure cookies."
              />
              <Concept
                name="Conditional rendering throughout the app"
                beginner="Some UI appears only when needed."
                engineering="Returning null or branching JSX avoids rendering hidden interactive surfaces."
                implementation="TaskModal returns null when closed; NotificationPanel returns null when closed; App.jsx gates AppShell; mobile overlay renders only when sidebarOpen."
                why="Conditional UI reduces DOM work and prevents inactive UI from receiving interactions."
                interview="Conditional rendering is used for auth boundaries, overlays, panels, and modals."
              />
            </div>
          </Section>

          <Section id="manual-20" title="20. Code Walkthrough" icon={Workflow}>
            <div style={{ display: "grid", gap: 10 }}>
              {codeWalkthroughs.map((flow) => (
                <Accordion key={flow.title} title={flow.title}>
                  <ol style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.75, fontSize: 14 }}>
                    {flow.steps.map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </Accordion>
              ))}
            </div>
          </Section>

          <Section id="manual-21" title="21. What Interviewers May Try To Trap You On" icon={ShieldCheck}>
            <div style={{ display: "grid", gap: 12 }}>
              {traps.map((item) => (
                <Card key={item.trap} accent="#ef4444">
                  <H3>{item.trap}</H3>
                  <P><strong>What not to say:</strong> {item.avoid}</P>
                  <P><strong>Safe answer:</strong> {item.safe}</P>
                  <P><strong>Senior answer:</strong> {item.senior}</P>
                  <P><strong>Junior answer sounds like:</strong> short, absolute, and unaware of tradeoffs.</P>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="manual-22" title="22. Senior Frontend Engineering Thinking" icon={Layers}>
            <Table
              headers={["Decision", "Beginner Explanation", "Engineering Explanation", "Interview-Ready Answer"]}
              rows={[
                ["Zustand", "Shared state in one place.", "Small store API with direct hooks and low boilerplate.", "I used Zustand because the app needs shared server/UI state without Redux ceremony."],
                ["Modular folders", "Files are easier to find.", "Separates routing, reusable UI, state, and infrastructure concerns.", "The folder structure keeps ownership clear as the app grows."],
                ["Reusable components", "Do not repeat UI code.", "Encapsulate interaction and styling patterns behind stable props.", "Reusable components improve consistency and reduce maintenance cost."],
                ["API abstraction", "One file talks to backend.", "HTTP/token/error behavior is centralized and replaceable.", "api.js lets components express intent instead of transport details."],
                ["Socket.IO", "Live updates.", "Server-pushed events reduce stale collaborative UI.", "Sockets complement REST for real-time task and notification events."],
                ["Client-side search", "Fast for small data.", "Avoids backend complexity but has scale limits.", "For this dataset client-side search is acceptable; at scale I would move to indexed backend search."],
              ]}
            />
          </Section>

          <Section id="manual-23" title="23. If Interviewer Asks Deep React Questions" icon={Code2}>
            <Table
              headers={["Concept", "TrackFlow Example", "Strong Answer"]}
              rows={[
                ["useState", "Login form, Board activeTask, TaskModal form.", "Use it for local, temporary UI state that one component owns."],
                ["useEffect", "AppShell fetchAll, Header keyboard listener, Sidebar debounce.", "Use effects to synchronize with external systems, events, timers, or startup fetching."],
                ["Controlled components", "TaskModal inputs and selects.", "The React state is the source of truth for form values."],
                ["Prop drilling", "Avoided for tasks and notifications through Zustand.", "Global store prevents passing shared state through unrelated layers."],
                ["Reconciliation", "Task rows/cards update after map/filter state changes.", "React compares previous and next element trees and commits minimal DOM updates."],
                ["Dependency arrays", "fetchAll and keyboard listener effects include dependencies.", "Dependencies tell React when external synchronization must re-run."],
                ["Conditional rendering", "TaskModal and NotificationPanel return null when closed.", "Do not render hidden interactive UI unless needed."],
                ["Async operations", "Store actions await api calls then set state.", "Async flows should have clear loading/error behavior and predictable state updates."],
              ]}
            />
          </Section>

          <Section id="manual-24" title="24. Most Important Files To Study" icon={BookOpen}>
            <Table
              headers={["Rank", "File", "Why it matters", "Focus"]}
              rows={rankedFiles}
            />
          </Section>

          <Section id="manual-25" title="25. Complete Project Mental Model" icon={Workflow}>
            <Card accent="#6366f1">
              <Flow items={["User opens app", "React initializes in main.jsx", "BrowserRouter starts route matching", "useAuthStore reads localStorage", "App.jsx evaluates protected routes", "AppShell renders Sidebar, Header, main route, TaskModal", "fetchAll loads backend data", "api.js sends token-authenticated requests", "server/index.js verifies token and queries SQLite", "Zustand receives responses", "Components subscribed to store render data", "User actions call store actions", "Store actions call API and update state", "Socket events synchronize changes across clients", "The UI stays in sync with global state"]} />
              <P>
                The project clicks when you see it as three loops: authentication controls access, fetchAll hydrates shared state,
                and user actions continuously move data through store actions, backend persistence, and real-time broadcasts.
              </P>
            </Card>
          </Section>
        </main>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .manual-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
