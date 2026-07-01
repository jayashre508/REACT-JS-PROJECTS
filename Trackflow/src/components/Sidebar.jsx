import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { LayoutDashboard, Kanban, List, GitBranch, Archive, Users, Settings, Target, Zap, BarChart2, Info, X, Search } from "lucide-react";
import Logo from "./Logo";
import useAuthStore from "../store/useAuthStore";
import useAppStore from "../store/useAppStore";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Board",     path: "/board",     icon: Kanban },
  { label: "List",      path: "/list",      icon: List },
  { label: "Timeline",  path: "/timeline",  icon: GitBranch },
  { label: "Backlog",   path: "/backlog",   icon: Archive },
];

const planningItems = [
  { label: "Goals",   path: "/goals",   icon: Target },
  { label: "Sprints", path: "/sprints", icon: Zap },
  { label: "Reports", path: "/reports", icon: BarChart2 },
];

const bottomItems = [
  { label: "Team",     path: "/team",     icon: Users },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "About",    path: "/about",    icon: Info },
];

export default function Sidebar({ onClose }) {
  const { currentUser } = useAuthStore();
  return (
    <div className="w-64 h-full text-white flex flex-col" style={{
      background: "linear-gradient(160deg, #080b14 0%, #0f0c29 40%, #1a1560 80%, #24243e 100%)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -60, left: -60, width: 200, height: 200,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%)",
        pointerEvents: "none", animation: "orb3 14s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: 40, right: -40, width: 160, height: 160,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)",
        pointerEvents: "none", animation: "orb2 18s ease-in-out infinite",
      }} />

      {/* TOP */}
      <div className="flex-1 overflow-y-auto sidebar-scroll p-4">

        {/* Logo row */}
        <div className="flex items-center justify-between mb-6">
          <Logo size={32} textSize="text-lg" />
          {/* Close button — mobile only */}
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 text-indigo-300 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <SidebarSearch onClose={onClose} />

        {/* WORKSPACE */}
        <p className="text-xs font-semibold text-indigo-300/60 mb-2 tracking-widest px-1">WORKSPACE</p>
        <div className="flex flex-col gap-0.5 mb-5">
          {menuItems.map((item, i) => <MenuItem key={item.path} {...item} onClose={onClose} animDelay={i * 40} />)}
        </div>

        {/* PLANNING */}
        <p className="text-xs font-semibold text-indigo-300/60 mb-2 tracking-widest px-1">PLANNING</p>
        <div className="flex flex-col gap-0.5">
          {planningItems.map((item, i) => <MenuItem key={item.path} {...item} onClose={onClose} animDelay={200 + i * 40} />)}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex flex-col gap-0.5 mb-4">
          {bottomItems.map((item, i) => <MenuItem key={item.path} {...item} onClose={onClose} animDelay={350 + i * 40} />)}
        </div>

        {/* Profile */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
          borderRadius: 14, background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.2s", cursor: "default",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${currentUser?.color || "#3b82f6"}, #7c3aed)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
            boxShadow: `0 2px 10px ${currentUser?.color || "#3b82f6"}60`,
          }}>
            {currentUser?.initials || "SC"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#e0e7ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentUser?.name || "Sarah Chen"}
            </p>
            <p style={{ fontSize: 11, color: "rgba(165,180,252,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentUser?.role || "Product Lead"}
            </p>
          </div>
          <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 6px #22c55e", animation: "glowPulse 2s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}

function SidebarSearch({ onClose }) {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const { tasks, setSearchQuery } = useAppStore();
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 180);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => {
    const query = debouncedQ.trim();
    if (query.length < 1) return [];
    const lq = query.toLowerCase();

    return tasks
      .filter((t) => {
        const title = (t.title || "").toLowerCase();
        const id = (t.id || "").toLowerCase();
        return title.includes(lq) || id.includes(lq);
      })
      .slice(0, 5);
  }, [debouncedQ, tasks]);


  const go = (task) => {
    setSearchQuery(task.id);
    setQ("");
    navigate("/list");
    onClose();
  };

  return (
    <div className="mb-5" style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "7px 10px", border: "1px solid rgba(255,255,255,0.1)" }}>
        <Search size={13} style={{ color: "rgba(165,180,252,0.6)", flexShrink: 0 }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search tasks..."
          style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#fff", width: "100%" }}
        />
        {q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(165,180,252,0.6)", display: "flex", padding: 0 }}><X size={12} /></button>}
      </div>
      {focused && results.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1e1b4b", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", zIndex: 60 }}>
          {results.map((task) => (
            <button key={task.id} onMouseDown={() => go(task)} style={{ width: "100%", display: "flex", flexDirection: "column", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              <span style={{ fontSize: 12, color: "#e0e7ff", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</span>
              <span style={{ fontSize: 10, color: "rgba(165,180,252,0.6)" }}>{task.id} · {task.status}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, path, icon: MenuIcon, onClose, animDelay = 0 }) {
  const location = useLocation();
  const isActive = location.pathname === path;
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={path} onClick={onClose}
      className="anim-slide-left"
      style={{ animationDelay: `${animDelay}ms`, display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 12px", borderRadius: 12,
          fontSize: 13, fontWeight: 500,
          color: isActive ? "#fff" : hovered ? "#fff" : "rgba(165,180,252,0.65)",
          background: isActive
            ? "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(139,92,246,0.2))"
            : hovered ? "rgba(255,255,255,0.06)" : "transparent",
          boxShadow: isActive ? "inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 16px rgba(139,92,246,0.25)" : "none",
          transition: "all 0.18s cubic-bezier(0.22,1,0.36,1)",
          transform: hovered && !isActive ? "translateX(3px)" : "translateX(0)",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Active left bar */}
        {isActive && (
          <div style={{
            position: "absolute", left: 0, top: "20%", bottom: "20%",
            width: 3, borderRadius: 999,
            background: "linear-gradient(180deg, #818cf8, #a78bfa)",
            boxShadow: "0 0 8px #818cf8",
          }} />
        )}
        <MenuIcon size={15} style={{
          color: isActive ? "#a78bfa" : hovered ? "rgba(165,180,252,0.9)" : "rgba(165,180,252,0.5)",
          transition: "color 0.18s",
          flexShrink: 0,
        }} />
        {label}
      </div>
    </Link>
  );
}
