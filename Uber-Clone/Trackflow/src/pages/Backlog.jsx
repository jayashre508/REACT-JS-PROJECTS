import { Inbox, Bug, Zap, CheckSquare, AlertCircle, ArrowUp, Minus, ArrowDown } from "lucide-react";
import useAppStore from "../store/useAppStore";

const priorityConfig = {
  critical: { label: "Critical", color: "#ef4444", bg: "#fff1f2", icon: AlertCircle },
  high:     { label: "High",     color: "#f97316", bg: "#fff7ed", icon: ArrowUp },
  medium:   { label: "Medium",   color: "#3b82f6", bg: "#eff6ff", icon: Minus },
  low:      { label: "Low",      color: "#94a3b8", bg: "#f8fafc", icon: ArrowDown },
};

const typeIcon  = { bug: Bug, feature: Zap, task: CheckSquare };
const typeColor = { bug: "#ef4444", feature: "#8b5cf6", task: "#3b82f6" };

export default function Backlog() {
  const { tasks, sprints, members, updateTask, openTaskModal, searchQuery } = useAppStore();
  const q = searchQuery.toLowerCase();
  const backlog = tasks
    .filter((t) => t.status === "backlog" || !t.sprintId)
    .filter((t) => !q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q)));

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <Inbox size={18} className="text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">Backlog</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{backlog.length} items</span>
        </div>

        <div className="divide-y divide-gray-50">
          {backlog.map((task) => {
            const TypeIcon = typeIcon[task.type] || CheckSquare;
            const pCfg = priorityConfig[task.priority] || priorityConfig.medium;
            const PIcon = pCfg.icon;
            const member = members.find((m) => m.id === task.assigneeId);

            return (
              <div key={task.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/60 transition-all group">
                <TypeIcon size={14} style={{ color: typeColor[task.type] }} className="flex-shrink-0" />
                <span className="font-mono text-xs text-gray-400 w-16 flex-shrink-0">{task.id}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                  {task.tags?.length > 0 && (
                    <div className="flex gap-1 mt-0.5">
                      {task.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ color: pCfg.color, background: pCfg.bg }}>
                  <PIcon size={10} />{pCfg.label}
                </span>

                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">{task.storyPoints}pt</span>

                {/* Assign to sprint */}
                <select
                  value={task.sprintId || ""}
                  onChange={(e) => updateTask(task.id, { sprintId: e.target.value || null, status: e.target.value ? "todo" : "backlog" })}
                  className="text-xs px-2 py-1 rounded-lg border border-gray-200 outline-none bg-white text-gray-500 focus:border-blue-400 flex-shrink-0"
                >
                  <option value="">Add to sprint</option>
                  {sprints.filter((s) => s.status !== "completed").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                {member ? (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: member.color }}>
                    {member.initials}
                  </div>
                ) : (
                  <button onClick={() => openTaskModal(task)} className="text-xs text-blue-500 hover:underline opacity-0 group-hover:opacity-100 flex-shrink-0">
                    Assign
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {backlog.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">Backlog is empty 🎉</div>
        )}
      </div>
    </div>
  );
}
