import { useEffect, useState } from "react";
import { X, Tag, Sparkles, AlertTriangle, ListChecks } from "lucide-react";
import useAppStore from "../store/useAppStore";
import { api } from "../lib/api";

const priorities = ["low", "medium", "high", "critical"];
const statuses   = ["backlog", "todo", "in-progress", "review", "done"];
const types      = ["bug", "feature", "task"];

const emptyTaskForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  type: "task",
  assigneeId: "",
  sprintId: "",
  storyPoints: 3,
  dueDate: "",
  tags: "",
};

export default function TaskModal() {
  const { taskModalOpen, editingTask } = useAppStore();

  if (!taskModalOpen) return null;

  return <TaskModalForm key={editingTask?.id || "new"} editingTask={editingTask} />;
}

function TaskModalForm({ editingTask }) {
  const { closeTaskModal, addTask, updateTask, members, sprints } = useAppStore();
  const [duplicates, setDuplicates] = useState(null);
  const [bugAdvice, setBugAdvice] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState(() => {
    if (!editingTask) return emptyTaskForm;
    return {
      ...emptyTaskForm,
      ...editingTask,
      tags: editingTask.tags?.join(", ") || "",
      assigneeId: editingTask.assigneeId || "",
      sprintId: editingTask.sprintId || "",
      dueDate: editingTask.dueDate || "",
    };
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (form.type !== "bug" || (form.title + form.description).trim().length < 12) {
      setDuplicates(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        setDuplicates(await api.findDuplicates({ title: form.title, description: form.description, type: form.type, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) }));
      } catch {
        setDuplicates(null);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [form.title, form.description, form.tags, form.type]);

  const runBugAssistant = async () => {
    setAiLoading(true);
    try {
      const advice = await api.analyzeBug(form);
      setBugAdvice(advice);
      set("priority", advice.severity);
      set("tags", [...new Set([...form.tags.split(",").map((t) => t.trim()).filter(Boolean), ...advice.recommendedTags])].join(", "));
    } finally {
      setAiLoading(false);
    }
  };

  const runBreakdown = async () => {
    setAiLoading(true);
    try {
      const result = await api.breakdownTask(form);
      setBreakdown(result);
      set("storyPoints", result.storyPoints);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, storyPoints: Number(form.storyPoints), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), assigneeId: form.assigneeId || null, sprintId: form.sprintId || null };
    if (editingTask) updateTask(editingTask.id, payload);
    else addTask(payload);
    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeTaskModal} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-800">{editingTask ? `Edit ${editingTask.id}` : "Create New Task"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{editingTask ? "Update task details" : "Add a new task to your workspace"}</p>
          </div>
          <button onClick={closeTaskModal} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Fix login crash on Safari"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all"
            />
          </div>

          {duplicates?.matches?.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2">
                <AlertTriangle size={13} /> Possible duplicate - {duplicates.duplicateRisk}% similarity
              </div>
              {duplicates.matches.slice(0, 2).map((match) => (
                <p key={match.id} className="text-xs text-amber-800">{match.id}: {match.title} ({match.score}%)</p>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the task..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all resize-none"
            />
          </div>

          {/* Row: Type + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white capitalize">
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white capitalize">
                {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Status + Story Points */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white capitalize">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Story Points</label>
              <input type="number" min={1} max={21} value={form.storyPoints} onChange={(e) => set("storyPoints", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Row: Assignee + Sprint */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Assignee</label>
              <select value={form.assigneeId} onChange={(e) => set("assigneeId", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white">
                <option value="">Unassigned</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Sprint</label>
              <select value={form.sprintId} onChange={(e) => set("sprintId", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white">
                <option value="">No Sprint</option>
                {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Due Date + Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block flex items-center gap-1"><Tag size={11} /> Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="auth, ui, bug" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={closeTaskModal} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all">
              {editingTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
          </div>

          <aside className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 flex flex-col gap-3 h-fit">
            <div>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-2"><Sparkles size={15} className="text-indigo-600" /> AI Assist</p>
              <p className="text-xs text-gray-500 mt-1">Turn rough work into scoped, de-risked engineering tickets.</p>
            </div>
            <button type="button" onClick={runBugAssistant} disabled={aiLoading || form.type !== "bug"} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-indigo-100 text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition-all">
              <AlertTriangle size={13} /> Analyze Bug
            </button>
            <button type="button" onClick={runBreakdown} disabled={aiLoading || !form.title.trim()} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-indigo-100 text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition-all">
              <ListChecks size={13} /> Break Down Task
            </button>

            {bugAdvice && (
              <div className="rounded-xl bg-white border border-indigo-100 p-3">
                <p className="text-xs font-bold text-gray-800 mb-2">Bug assistant</p>
                <p className="text-xs text-gray-600 mb-2">Severity: {bugAdvice.severity}</p>
                <p className="text-xs text-gray-600 mb-2">Modules: {bugAdvice.affectedModules.join(", ")}</p>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                  {bugAdvice.likelyRootCauses.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}

            {breakdown && (
              <div className="rounded-xl bg-white border border-indigo-100 p-3">
                <p className="text-xs font-bold text-gray-800 mb-2">Acceptance criteria</p>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                  {breakdown.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p className="text-xs font-bold text-gray-800 mt-3 mb-2">Subtasks</p>
                {breakdown.subtasks.slice(0, 5).map((item) => (
                  <p key={item.area} className="text-xs text-gray-600">{item.area}: {item.points} pts</p>
                ))}
              </div>
            )}
          </aside>
        </form>
      </div>
    </div>
  );
}
