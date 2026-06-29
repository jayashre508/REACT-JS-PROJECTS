import useAppStore from "../store/useAppStore";

const priorityColor = { critical: "#ef4444", high: "#f97316", medium: "#3b82f6", low: "#94a3b8" };
const statusColor   = { todo: "#3b82f6", "in-progress": "#f59e0b", review: "#8b5cf6", done: "#10b981", backlog: "#94a3b8" };

function daysBetween(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
}

function dayOffset(start, taskStart) {
  return Math.max(0, Math.round((new Date(taskStart) - new Date(start)) / 86400000));
}

export default function Timeline() {
  const { tasks, sprints, members } = useAppStore();

  return (
    <div className="flex flex-col gap-6">
      {sprints.map((sprint) => {
        const sprintTasks = tasks.filter((t) => t.sprintId === sprint.id && t.createdAt && t.dueDate);
        const totalDays   = daysBetween(sprint.startDate, sprint.endDate);

        return (
          <div key={sprint.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Sprint Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <span className="text-sm font-bold text-gray-800">{sprint.name}</span>
                <span className="ml-2 text-xs text-gray-400">{sprint.startDate} → {sprint.endDate}</span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sprint.status === "active" ? "bg-emerald-50 text-emerald-600" : sprint.status === "planned" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                {sprint.status}
              </span>
            </div>

            {/* Day headers */}
            <div className="flex px-6 py-2 border-b border-gray-50 bg-gray-50">
              <div className="w-48 flex-shrink-0" />
              <div className="flex-1 flex">
                {Array.from({ length: Math.min(totalDays, 20) }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-xs text-gray-300">{i + 1}</div>
                ))}
              </div>
            </div>

            {/* Task rows */}
            <div className="divide-y divide-gray-50">
              {sprintTasks.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-400">No tasks with dates in this sprint</div>
              )}
              {sprintTasks.map((task) => {
                const member  = members.find((m) => m.id === task.assigneeId);
                const offset  = dayOffset(sprint.startDate, task.createdAt);
                const duration = daysBetween(task.createdAt, task.dueDate);
                const maxDays  = Math.min(totalDays, 20);
                const leftPct  = (Math.min(offset, maxDays) / maxDays) * 100;
                const widthPct = (Math.min(duration, maxDays - offset) / maxDays) * 100;

                return (
                  <div key={task.id} className="flex items-center px-6 py-2.5 hover:bg-gray-50/60 transition-all">
                    {/* Task info */}
                    <div className="w-48 flex-shrink-0 flex items-center gap-2 pr-4">
                      {member && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: member.color, fontSize: 9 }}>
                          {member.initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{task.title}</p>
                        <p className="text-xs text-gray-400 font-mono">{task.id}</p>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="flex-1 relative h-7">
                      <div className="absolute inset-y-0 flex items-center" style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 4)}%` }}>
                        <div
                          className="h-5 rounded-full flex items-center px-2 text-white text-xs font-medium shadow-sm w-full"
                          style={{ background: task.status === "done" ? statusColor.done : priorityColor[task.priority] }}
                          title={`${task.createdAt} → ${task.dueDate}`}
                        >
                          <span className="truncate">{task.status === "done" ? "✓" : ""}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
