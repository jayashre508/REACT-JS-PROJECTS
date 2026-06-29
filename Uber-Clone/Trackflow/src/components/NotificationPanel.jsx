import { X, Bell, CheckCheck, GitCommit, Clock, MessageSquare, AlertCircle } from "lucide-react";
import useAppStore from "../store/useAppStore";

const typeIcon = {
  assign:  { icon: GitCommit,     color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  due:     { icon: Clock,         color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  comment: { icon: MessageSquare, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  sprint:  { icon: AlertCircle,   color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  status:  { icon: CheckCheck,    color: "#14b8a6", bg: "rgba(20,184,166,0.12)" },
};

export default function NotificationPanel() {
  const { notifPanelOpen, notifications, toggleNotifPanel, markAllRead, dismissNotif } = useAppStore();
  const unread = notifications.filter((n) => !n.read).length;

  if (!notifPanelOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 cursor-pointer" onClick={toggleNotifPanel} />
      <div className="fixed top-17 right-4 z-50 w-80 bg-surface rounded-4xl shadow-lg border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between py-3 px-4 border-b border-border-subtle bg-surface2">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-secondary" />
            <span className="text-sm font-bold text-primary">Notifications</span>
            {unread > 0 && (
              <span className="text-2xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                {unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-2xs text-indigo-600 bg-0 border-0 cursor-pointer px-2 py-1 rounded-lg font-semibold hover:bg-hover transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={toggleNotifPanel}
              className="py-1.25 px-1.25 rounded-lg border-0 bg-hover cursor-pointer text-muted flex hover:bg-border transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-95 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 px-0 text-center text-sm text-muted">
              No notifications
            </div>
          ) : (
            notifications.map((n) => {
              const t = typeIcon[n.type] || typeIcon.status;
              const Icon = t.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 py-3 px-4 border-b border-border-subtle transition-colors duration-150 ${
                    !n.read ? "bg-indigo-500/4" : "bg-transparent"
                  }`}
                >
                  <div
                    style={{ background: t.bg }}
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  >
                    <Icon size={14} style={{ color: t.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-secondary leading-relaxed">{n.text}</p>
                    <p className="text-2xs text-muted mt-0.5">{n.time}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    {!n.read && <span className="w-1.75 h-1.75 rounded-full bg-indigo-600" />}
                    <button
                      onClick={() => dismissNotif(n.id)}
                      className="bg-0 border-0 cursor-pointer text-muted flex p-0.5 opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
