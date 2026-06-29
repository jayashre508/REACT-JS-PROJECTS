import { useLocation, Link, useNavigate } from "react-router-dom";
import { Bell, Search, Plus, Menu, LogOut, Sun, Moon, Settings, User, ChevronRight, Command, X, Bug, Zap, CheckSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useAppStore from "../store/useAppStore";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import NotificationPanel from "./NotificationPanel";

const breadcrumbMap = {
  "/dashboard": "Dashboard",
  "/board":     "Board",
  "/list":      "Tasks",
  "/timeline":  "Timeline",
  "/backlog":   "Backlog",
  "/goals":     "Goals",
  "/sprints":   "Sprints",
  "/reports":   "Reports",
  "/team":      "Team",
  "/settings":  "Settings",
  "/about":     "About",
};

const pageSubtitles = {
  "/dashboard": "Overview & Analytics",
  "/board":     "Sprint 12 · Kanban",
  "/list":      "All Tasks",
  "/timeline":  "Gantt View",
  "/backlog":   "Unplanned Items",
  "/goals":     "OKRs & Milestones",
  "/sprints":   "Sprint Planning",
  "/reports":   "Analytics & Reports",
  "/team":      "Members & Workload",
  "/settings":  "Preferences",
  "/about":     "About TrackFlow",
};

const typeIcon  = { bug: Bug, feature: Zap, task: CheckSquare };
const typeColor = { bug: "#ef4444", feature: "#8b5cf6", task: "#3b82f6" };

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const page     = breadcrumbMap[location.pathname] || "TrackFlow";
  const subtitle = pageSubtitles[location.pathname] || "";

  const { openTaskModal, toggleNotifPanel, notifications, tasks, setSearchQuery } = useAppStore();
  const { currentUser, logout } = useAuthStore();
  const { dark, toggleDark } = useThemeStore();

  const {  fetchNotifications } = useAppStore();

  const unread = notifications.filter((n) => !n.read).length;
  const [profileOpen, setProfileOpen]   = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [localQuery, setLocalQuery]     = useState("");
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Cmd/Ctrl+K focuses search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setLocalQuery("");
        setSearchFocused(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);

    fetchNotifications().catch(() => {});
    return () => window.removeEventListener("keydown", handler);

     
  }, [fetchNotifications]);

  // Live search results (max 6)
  const results = localQuery.trim().length >= 1
    ? tasks.filter((t) => {
        const q = localQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q));
      }).slice(0, 6)
    : [];

  const handleSelectResult = (task) => {
    setLocalQuery("");
    setSearchFocused(false);
    // Navigate to list with filter applied
    setSearchQuery(task.id);
    navigate("/list");
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && localQuery.trim()) {
      setSearchQuery(localQuery.trim());
      setLocalQuery("");
      setSearchFocused(false);
      navigate("/list");
    }
  };

  const showDropdown = searchFocused && localQuery.trim().length >= 1;

  return (
    <>
      <header className="fixed inset-x-0 top-0 h-15 bg-header-bg border-b border-header-border flex items-center justify-between px-5 z-30 backdrop-blur-xl gap-3 shadow-sm">

        {/* ── Left: hamburger + page title ── */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <button onClick={onMenuClick} className="lg:hidden p-1.75 rounded-xl border-0 bg-surface2 cursor-pointer text-secondary flex items-center flex-shrink-0 hover:bg-hover transition-colors">
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-primary whitespace-nowrap">
                {page}
              </span>
              {subtitle && (
                <>
                  <ChevronRight size={13} className="text-muted flex-shrink-0" />
                  <span className="text-xs text-muted whitespace-nowrap overflow-hidden text-ellipsis">
                    {subtitle}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Center: Search with live dropdown ── */}
        <div className="relative w-clamp-160-300 flex-shrink-0" ref={dropdownRef}>
          <div className={`flex items-center gap-2 px-3 py-1.75 rounded-2xl border transition-all duration-180 ${
            searchFocused
              ? "bg-surface border-indigo-500 shadow-indigo-ring"
              : "bg-input-bg border-border"
          }`}>
            <Search size={13} className="text-muted flex-shrink-0" />
            <input
              ref={searchRef}
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              onKeyDown={handleSearchSubmit}
              placeholder="Search tasks…"
              className="bg-transparent border-0 outline-0 text-xs flex-1 text-primary min-w-0"
            />
            {localQuery ? (
              <button onClick={() => setLocalQuery("")} className="bg-0 border-0 cursor-pointer text-muted flex p-0 hover:text-primary transition-colors">
                <X size={12} />
              </button>
            ) : (
              <div className="flex items-center gap-0.5 bg-hover rounded-md px-1.25 py-0.5 flex-shrink-0">
                <Command size={9} className="text-muted" />
                <span className="text-2xs text-muted font-semibold">K</span>
              </div>
            )}
          </div>

          {/* Live results dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-14 bg-surface rounded-3xl border border-border shadow-lg overflow-hidden z-100">
              {results.length === 0 ? (
                <div className="py-3.5 px-4 text-xs text-muted text-center">
                  No tasks found for "{localQuery}"
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 text-2xs font-bold text-muted uppercase tracking-wide">
                    Tasks · {results.length} result{results.length !== 1 ? "s" : ""}
                  </div>
                  {results.map((task) => {
                    const Icon = typeIcon[task.type] || CheckSquare;
                    return (
                      <button
                        key={task.id}
                        onMouseDown={() => handleSelectResult(task)}
                        className="w-full flex items-center gap-2.5 py-2.25 px-3 bg-0 border-0 cursor-pointer text-left border-t border-border hover:bg-hover transition-colors"
                      >
                        <Icon size={13} style={{ color: typeColor[task.type] }} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                            {task.title}
                          </p>
                          <p className="text-2xs text-muted">{task.id} · {task.status}</p>
                        </div>
                      </button>
                    );
                  })}
                  <button
                    onMouseDown={() => { setSearchQuery(localQuery); setLocalQuery(""); setSearchFocused(false); navigate("/list"); }}
                    className="w-full py-2.25 px-3 bg-surface2 border-0 border-t border-border text-xs text-indigo-600 font-semibold cursor-pointer text-left hover:bg-hover transition-colors"
                  >
                    View all results for "{localQuery}" →
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Right: actions ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* New Task */}
          <button onClick={() => openTaskModal()} className="flex items-center gap-1.5 px-3.5 py-1.75 rounded-xl border-0 bg-gradient-indigo text-white text-xs font-semibold cursor-pointer shadow-indigo-glow whitespace-nowrap hover:shadow-lg transition-all">
            <Plus size={15} />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Dark mode toggle */}
          <button onClick={toggleDark} title={dark ? "Light mode" : "Dark mode"} className="p-2 rounded-xl border border-border bg-surface2 cursor-pointer text-secondary flex items-center hover:bg-hover transition-all">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Bell */}
          <button onClick={toggleNotifPanel} className="relative p-2 rounded-xl border border-border bg-surface2 cursor-pointer text-secondary flex items-center hover:bg-hover transition-all">
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-header-bg" />
            )}
          </button>

          {/* Avatar + dropdown */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2.5 py-1.25 pl-1.25 rounded-2xl border border-border bg-surface2 cursor-pointer transition-all hover:bg-hover">
              <div style={{ background: `linear-gradient(135deg, ${currentUser?.color || "#4f46e5"}, #7c3aed)` }} className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-2xs font-bold flex-shrink-0">
                {currentUser?.initials || "SC"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-primary leading-tight">
                  {currentUser?.name?.split(" ")[0] || "Sarah"}
                </p>
                <p className="text-2xs text-muted leading-tight">
                  {currentUser?.role || "Product Lead"}
                </p>
              </div>
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-40 cursor-pointer" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-55 bg-surface rounded-3xl shadow-lg border border-border overflow-hidden">
                  <div className="p-3.5 border-b border-border-subtle bg-surface2">
                    <div className="flex items-center gap-2.5">
                      <div style={{ background: `linear-gradient(135deg, ${currentUser?.color || "#4f46e5"}, #7c3aed)` }} className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {currentUser?.initials || "SC"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{currentUser?.name}</p>
                        <p className="text-2xs text-muted mt-0.25">{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <Link to="/settings" onClick={() => setProfileOpen(false)}>
                      <DropdownItem icon={<Settings size={14} />} label="Settings" />
                    </Link>
                    <Link to="/team" onClick={() => setProfileOpen(false)}>
                      <DropdownItem icon={<User size={14} />} label="Team" />
                    </Link>
                    <div className="h-px bg-border-subtle my-1" />
                    <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full bg-0 border-0 p-0 cursor-pointer">
                      <DropdownItem icon={<LogOut size={14} />} label="Sign out" danger />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <NotificationPanel />
    </>
  );
}

function DropdownItem({ icon, label, danger }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-2 py-2 px-2.5 rounded-xl font-medium text-xs transition-all duration-120 cursor-pointer ${
        hovered
          ? danger
            ? "bg-red-500/8"
            : "bg-hover"
          : "bg-transparent"
      } ${danger ? "text-red-500" : "text-secondary"}`}
    >
      {icon}{label}
    </div>
  );
}
