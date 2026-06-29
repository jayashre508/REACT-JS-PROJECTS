import { Mail, CheckCircle, Clock, AlertCircle } from "lucide-react";
import useAppStore from "../store/useAppStore";

export default function Team() {
  const { members, tasks } = useAppStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {members.map((member) => {
        const assigned = tasks.filter((t) => t.assigneeId === member.id);
        const done     = assigned.filter((t) => t.status === "done").length;
        const inProg   = assigned.filter((t) => t.status === "in-progress").length;
        const critical = assigned.filter((t) => t.priority === "critical" && t.status !== "done").length;
        const pct      = assigned.length ? Math.round((done / assigned.length) * 100) : 0;

        return (
          <div key={member.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm" style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}99)` }}>
                {member.initials}
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">{member.name}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 font-medium">{member.role}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center bg-gray-50 rounded-xl py-2">
                <p className="text-lg font-bold text-gray-800">{assigned.length}</p>
                <p className="text-xs text-gray-400">Assigned</p>
              </div>
              <div className="text-center bg-emerald-50 rounded-xl py-2">
                <p className="text-lg font-bold text-emerald-600">{done}</p>
                <p className="text-xs text-gray-400">Done</p>
              </div>
              <div className="text-center bg-orange-50 rounded-xl py-2">
                <p className="text-lg font-bold text-orange-500">{inProg}</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Completion</span>
                <span className="text-xs font-bold text-gray-700">{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: member.color }} />
              </div>
            </div>

            {/* Critical badge */}
            {critical > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">
                <AlertCircle size={12} />
                {critical} critical issue{critical > 1 ? "s" : ""} open
              </div>
            )}

            {/* Recent tasks */}
            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent Tasks</p>
              <div className="flex flex-col gap-1.5">
                {assigned.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    {t.status === "done"
                      ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                      : <Clock size={12} className="text-gray-300 flex-shrink-0" />}
                    <span className="text-xs text-gray-500 truncate">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
