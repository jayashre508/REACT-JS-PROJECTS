import { useState } from "react";
import { Target, CheckCircle, AlertTriangle, XCircle, Link, Plus, X } from "lucide-react";
import useAppStore from "../store/useAppStore";

const statusConfig = {
  "on-track": { label: "On Track", color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: CheckCircle },
  "at-risk":  { label: "At Risk",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: AlertTriangle },
  "behind":   { label: "Behind",   color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: XCircle },
};

const progressColor = (pct) => {
  if (pct >= 70) return "#10b981";
  if (pct >= 40) return "#f59e0b";
  return "#ef4444";
};

function GoalCard({ goal, onUpdate }) {
  const sCfg  = statusConfig[goal.status] || statusConfig["on-track"];
  const Icon  = sCfg.icon;
  const color = progressColor(goal.progress);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(99,102,241,0.1)" }}>
          <Target size={20} style={{ color: "#6366f1" }} />
        </div>
        {/* Status selector */}
        <select
          value={goal.status}
          onChange={(e) => onUpdate(goal.id, { status: e.target.value })}
          className="text-xs px-2.5 py-1 rounded-full font-semibold border-0 outline-none cursor-pointer"
          style={{ color: sCfg.color, background: sCfg.bg }}
        >
          {Object.entries(statusConfig).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-800 mb-1">{goal.title}</h3>
        <p className="text-xs text-gray-400 leading-relaxed">{goal.description}</p>
      </div>

      {/* Progress slider */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-bold" style={{ color }}>{goal.progress}%</span>
        </div>
        <input
          type="range" min={0} max={100} value={goal.progress}
          onChange={(e) => onUpdate(goal.id, { progress: Number(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: color }}
        />
        <div className="h-1.5 rounded-full bg-gray-100 mt-1 overflow-hidden -mt-3 pointer-events-none">
          <div className="h-1.5 rounded-full transition-all" style={{ width: `${goal.progress}%`, background: color }} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Link size={12} />
          {goal.linkedTasks} linked tasks
        </div>
        <span className="text-xs text-gray-400">Due {goal.dueDate}</span>
      </div>
    </div>
  );
}

function AddGoalModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", linkedTasks: 0, progress: 0, status: "on-track" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">New Goal</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={16} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Title *</label>
            <input required value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Ship v2.0" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-400 bg-white">
                {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => { if (form.title.trim()) { onAdd(form); onClose(); } }}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Create Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Goals() {
  const { goals, updateGoal, addGoal } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Goals</h2>
          <p className="text-xs text-gray-400 mt-0.5">{goals.length} active goals · drag sliders to update progress</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", boxShadow: "0 2px 10px rgba(99,102,241,0.3)" }}>
          <Plus size={15} /> New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} />
        ))}
      </div>

      {showAdd && <AddGoalModal onClose={() => setShowAdd(false)} onAdd={addGoal} />}
    </div>
  );
}
