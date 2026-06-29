import { useState } from "react";
import { X, Tag } from "lucide-react";
import useAppStore from "../store/useAppStore";

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-auto overflow-hidden">

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

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

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
        </form>
      </div>
    </div>
  );
}
