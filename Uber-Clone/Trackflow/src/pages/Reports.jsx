import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import useAppStore from "../store/useAppStore";

const burndown = [
  { day: "Day 1",  ideal: 42, actual: 42 },
  { day: "Day 3",  ideal: 36, actual: 38 },
  { day: "Day 5",  ideal: 30, actual: 33 },
  { day: "Day 7",  ideal: 24, actual: 27 },
  { day: "Day 9",  ideal: 18, actual: 22 },
  { day: "Day 11", ideal: 12, actual: 16 },
  { day: "Day 13", ideal: 6,  actual: 11 },
  { day: "Day 15", ideal: 0,  actual: 7  },
];

const velocity = [
  { sprint: "S9",  committed: 30, completed: 28 },
  { sprint: "S10", committed: 35, completed: 32 },
  { sprint: "S11", committed: 38, completed: 38 },
  { sprint: "S12", committed: 42, completed: 13 },
];

const bugTrend = [
  { week: "W1", opened: 5, closed: 3 },
  { week: "W2", opened: 8, closed: 6 },
  { week: "W3", opened: 4, closed: 7 },
  { week: "W4", opened: 6, closed: 5 },
  { week: "W5", opened: 3, closed: 6 },
  { week: "W6", opened: 7, closed: 4 },
  { week: "W7", opened: 2, closed: 5 },
  { week: "W8", opened: 4, closed: 6 },
];

const resolution = [
  { priority: "Critical", avg: 1.2 },
  { priority: "High",     avg: 2.8 },
  { priority: "Medium",   avg: 5.4 },
  { priority: "Low",      avg: 9.1 },
];

const resColors = { Critical: "#ef4444", High: "#f97316", Medium: "#3b82f6", Low: "#94a3b8" };

const tooltipStyle = { borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", boxShadow: "var(--shadow-md)", fontSize: "12px" };

function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-base font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5 mb-4">{subtitle}</p>}
      {children}
    </div>
  );
}

export default function Reports() {
  const { tasks } = useAppStore();

  const totalBugs     = tasks.filter((t) => t.type === "bug").length;
  const resolvedBugs  = tasks.filter((t) => t.type === "bug" && t.status === "done").length;
  const criticalOpen  = tasks.filter((t) => t.priority === "critical" && t.status !== "done").length;
  const avgResolution = "3.2 days";

  return (
    <div className="flex flex-col gap-4">

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Bugs",       value: totalBugs,     color: "#ef4444", bg: "#fff1f2" },
          { label: "Resolved Bugs",    value: resolvedBugs,  color: "#10b981", bg: "#f0fdf4" },
          { label: "Critical Open",    value: criticalOpen,  color: "#f97316", bg: "#fff7ed" },
          { label: "Avg Resolution",   value: avgResolution, color: "#8b5cf6", bg: "#f5f3ff" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{k.label}</p>
            <p className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Sprint Burndown" subtitle="Ideal vs actual remaining story points">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={burndown}>
              <defs>
                <linearGradient id="ideal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="ideal"  stroke="#94a3b8" fill="url(#ideal)"  strokeWidth={2} strokeDasharray="5 5" name="Ideal" dot={false} />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" fill="url(#actual)" strokeWidth={2.5} name="Actual" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Sprint Velocity" subtitle="Committed vs completed story points per sprint">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={velocity} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="committed" fill="#e0e7ff" radius={[4, 4, 0, 0]} name="Committed" />
              <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Bug Trend" subtitle="Opened vs closed bugs per week">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={bugTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="opened" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Opened" />
              <Line type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2.5} dot={false} name="Closed" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Avg Resolution Time" subtitle="Average days to resolve by priority">
          <div className="flex flex-col gap-4 mt-2">
            {resolution.map((r) => (
              <div key={r.priority} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600 w-16">{r.priority}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 rounded-full" style={{ width: `${(r.avg / 10) * 100}%`, background: resColors[r.priority] }} />
                </div>
                <span className="text-xs font-bold text-gray-700 w-14 text-right">{r.avg} days</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
