import { useState } from "react";
import { Zap, Calendar, CheckCircle, Clock, Lock, Plus, X, AlertTriangle, Scale } from "lucide-react";
import useAppStore from "../store/useAppStore";
import { api } from "../lib/api";
import AiActionPanel from "../components/AiActionPanel";

const statusConfig = {
  active:    { label: "Active",    color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: Zap },
  planned:   { label: "Planned",   color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  icon: Clock },
  completed: { label: "Completed", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", icon: Lock },
};

function AddSprintModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", goal: "", startDate: "", endDate: "", status: "planned", storyPoints: 0 });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">New Sprint</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Sprint Name *</label>
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Sprint 14"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Goal</label>
            <input value={form.goal} onChange={(e) => set("goal", e.target.value)} placeholder="Sprint objective..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 bg-white">
                {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Story Points</label>
              <input type="number" min={0} value={form.storyPoints} onChange={(e) => set("storyPoints", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => { if (form.name.trim()) { onAdd(form); onClose(); } }}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Create Sprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sprints() {
  const { sprints, tasks, updateSprint, addSprint } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [risk, setRisk] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const activeSprint = sprints.find((s) => s.status === "active") || sprints[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Sprints</h2>
          <p className="text-xs text-gray-400 mt-0.5">{sprints.filter((s) => s.status === "active").length} active · {sprints.filter((s) => s.status === "planned").length} planned</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 2px 10px rgba(99,102,241,0.3)" }}>
          <Plus size={15} /> New Sprint
        </button>
      </div>

      <AiActionPanel
        title="Sprint Risk Prediction"
        subtitle="Predict delivery confidence, blockers, overload, and workload redistribution."
        action="Predict Risk"
        loading={riskLoading}
        onAction={async () => {
          setRiskLoading(true);
          try {
            setRisk(await api.predictSprintRisk(activeSprint?.id));
          } finally {
            setRiskLoading(false);
          }
        }}
      >
        {risk ? (
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Delivery confidence</p>
              <p className={`text-4xl font-black mt-2 ${risk.confidence >= 70 ? "text-emerald-600" : "text-amber-600"}`}>{risk.confidence}%</p>
              <p className="text-xs text-gray-500 mt-1">{risk.status} - health {risk.healthScore}/10</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800"><AlertTriangle size={15} className="text-red-500" /> Blockers</div>
              {risk.blockers.length === 0 ? <p className="text-xs text-gray-500">No critical blockers detected.</p> : risk.blockers.map((b) => <p key={b.id} className="text-xs text-gray-600 mb-2">{b.id}: {b.title}</p>)}
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-800"><Scale size={15} className="text-indigo-500" /> Redistribution</div>
              {(risk.redistribution.length ? risk.redistribution : ["Current workload distribution is acceptable."]).map((item) => <p key={item} className="text-xs text-gray-600 mb-2">{item}</p>)}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Run prediction before sprint review to catch delivery risk early.</p>
        )}
      </AiActionPanel>

      <div className="grid grid-cols-1 gap-4">
        {sprints.map((sprint) => {
          const sprintTasks   = tasks.filter((t) => t.sprintId === sprint.id);
          const done          = sprintTasks.filter((t) => t.status === "done").length;
          const total         = sprintTasks.length;
          const pct           = total ? Math.round((done / total) * 100) : 0;
          const completedPts  = sprintTasks.filter((t) => t.status === "done").reduce((a, t) => a + (t.storyPoints || 0), 0);
          const sCfg          = statusConfig[sprint.status] || statusConfig.planned;
          const Icon          = sCfg.icon;

          const breakdown = [
            { label: "To Do",       count: sprintTasks.filter((t) => t.status === "todo").length,        color: "#3b82f6" },
            { label: "In Progress", count: sprintTasks.filter((t) => t.status === "in-progress").length, color: "#f59e0b" },
            { label: "Review",      count: sprintTasks.filter((t) => t.status === "review").length,      color: "#8b5cf6" },
            { label: "Done",        count: done,                                                          color: "#10b981" },
          ];

          return (
            <div key={sprint.id} className={`bg-white rounded-2xl p-6 shadow-sm border ${sprint.status === "active" ? "border-indigo-200 ring-1 ring-indigo-100" : "border-gray-100"}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-800">{sprint.name}</h3>
                    {/* Inline status change */}
                    <select
                      value={sprint.status}
                      onChange={(e) => updateSprint(sprint.id, { status: e.target.value })}
                      className="text-xs px-2 py-0.5 rounded-full font-semibold border-0 outline-none cursor-pointer"
                      style={{ color: sCfg.color, background: sCfg.bg }}
                    >
                      {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                  <p className="text-xs text-gray-400">{sprint.goal}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">{pct}%</p>
                  <p className="text-xs text-gray-400">complete</p>
                </div>
              </div>

              <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }} />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                {[
                  { label: "Total Tasks",  value: total,         color: "#1e293b" },
                  { label: "Completed",    value: done,          color: "#10b981" },
                  { label: "Story Points", value: sprint.storyPoints, color: "#1e293b" },
                  { label: "Points Done",  value: completedPts,  color: "#4f46e5" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-3">
                  {breakdown.map((b) => (
                    <div key={b.label} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                      <span className="text-xs text-gray-500">{b.label}: <strong>{b.count}</strong></span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar size={12} />
                  {sprint.startDate} → {sprint.endDate}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && <AddSprintModal onClose={() => setShowAdd(false)} onAdd={addSprint} />}
    </div>
  );
}
