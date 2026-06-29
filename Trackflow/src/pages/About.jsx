import { Zap, Bug, BarChart2, Users, GitBranch, Shield, CheckCircle, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Bug,
    color: "#ef4444",
    bg: "#fff1f2",
    title: "Defect Tracking",
    desc: "Log, prioritize, and resolve bugs with full lifecycle management — from discovery to closure.",
  },
  {
    icon: BarChart2,
    color: "#3b82f6",
    bg: "#eff6ff",
    title: "Real-time Analytics",
    desc: "Live dashboards with sprint velocity, burndown charts, and team performance metrics.",
  },
  {
    icon: Users,
    color: "#8b5cf6",
    bg: "#f5f3ff",
    title: "Team Collaboration",
    desc: "Assign tasks, mention teammates, leave comments, and track workload across your entire team.",
  },
  {
    icon: GitBranch,
    color: "#10b981",
    bg: "#f0fdf4",
    title: "Sprint Planning",
    desc: "Plan sprints, set goals, track story points, and keep your team aligned every step of the way.",
  },
  {
    icon: Shield,
    color: "#f59e0b",
    bg: "#fffbeb",
    title: "Priority Management",
    desc: "Flag critical issues instantly. Never let a blocker slip through with smart priority filters.",
  },
  {
    icon: Zap,
    color: "#14b8a6",
    bg: "#f0fdfa",
    title: "Lightning Fast",
    desc: "Built on Vite + React for instant load times. A tool that keeps up with your team's pace.",
  },
];

const steps = [
  { step: "01", title: "Create a Project", desc: "Set up your workspace, invite your team, and define your project scope in minutes." },
  { step: "02", title: "Log Defects & Tasks", desc: "Add tasks or bugs with title, description, priority, assignee, and due date." },
  { step: "03", title: "Track on Board", desc: "Move tasks across Kanban columns — To Do, In Progress, Review, Done." },
  { step: "04", title: "Plan Sprints", desc: "Group tasks into sprints, set story points, and monitor progress in real time." },
  { step: "05", title: "Analyze & Improve", desc: "Use the dashboard to spot bottlenecks, review team workload, and ship faster." },
];

const stack = [
  { name: "React 19",      color: "#61dafb", desc: "UI Library" },
  { name: "Vite",          color: "#646cff", desc: "Build Tool" },
  { name: "Tailwind CSS",  color: "#38bdf8", desc: "Styling" },
  { name: "Socket.io",     color: "#f59e0b", desc: "Realtime updates" },
  { name: "Express",       color: "#000000", desc: "Backend server" },
  { name: "SQLite",        color: "#1f2937", desc: "Persistent storage" },
  { name: "Nodemailer",    color: "#14b8a6", desc: "Email notifications" },
  { name: "Multer",        color: "#8b5cf6", desc: "File uploads" },
  { name: "Jest",          color: "#ef4444", desc: "Unit testing" },
  { name: "Playwright",    color: "#6366f1", desc: "E2E testing" },
];

export default function About() {
  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-16">

      {/* ── Hero ── */}
      <div
        className="rounded-3xl p-10 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0c29, #1a1560, #24243e)" }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs px-3 py-1.5 rounded-full mb-4 border border-white/10">
            <Zap size={12} /> Version 1.0 — Built for modern teams
          </div>
          <h1 className="text-4xl font-bold mb-3 leading-tight">
            Track smarter. <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Ship faster.
            </span>
          </h1>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xl">
            TrackFlow is a modern full-stack project management app built for agile teams.
            Manage bugs, plan sprints, collaborate in real time, attach files to tasks, and
            ship with confidence using a React frontend and Node/Express backend.
          </p>
          <div className="flex items-center gap-2 mt-6 text-xs text-indigo-300">
            <CheckCircle size={14} className="text-emerald-400" /> Free to use
            <span className="mx-2 opacity-30">|</span>
            <CheckCircle size={14} className="text-emerald-400" /> No setup required
            <span className="mx-2 opacity-30">|</span>
            <CheckCircle size={14} className="text-emerald-400" /> Built with React + Vite
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">What TrackFlow offers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: f.bg }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How to Use ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">How to use TrackFlow</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {steps.map((s, i) => (
            <div key={s.step} className="flex items-start gap-5 p-5">
              <span className="text-2xl font-black text-gray-100 w-10 flex-shrink-0">{s.step}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <ArrowRight size={16} className="text-gray-200 mt-1 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Tech stack</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stack.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 text-center">
              <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
              <p className="text-xs font-semibold text-gray-700">{t.name}</p>
              <p className="text-xs text-gray-400">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer Note ── */}
      <div className="text-center text-xs text-gray-300 pb-4">
        Built with ❤️ by the TrackFlow team · v1.0
      </div>

    </div>
  );
}
