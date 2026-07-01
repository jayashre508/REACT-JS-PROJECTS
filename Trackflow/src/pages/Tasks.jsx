import { useMemo, useState } from "react";

import { Trash2, Edit2, ChevronUp, ChevronDown, Bug, Zap, CheckSquare, AlertCircle, ArrowUp, Minus, ArrowDown, X } from "lucide-react";
import useAppStore from "../store/useAppStore";

const priorityConfig = {
  critical: { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: AlertCircle },
  high:     { label: "High",     color: "#f97316", bg: "rgba(249,115,22,0.1)", icon: ArrowUp },
  medium:   { label: "Medium",   color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: Minus },
  low:      { label: "Low",      color: "#94a3b8", bg: "rgba(148,163,184,0.1)",icon: ArrowDown },
};

const statusConfig = {
  backlog:       { label: "Backlog",     color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
  todo:          { label: "To Do",       color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  "in-progress": { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  review:        { label: "Review",      color: "#8b5cf6", bg: "rgba(139,92,246,0.1)"  },
  done:          { label: "Done",        color: "#10b981", bg: "rgba(16,185,129,0.1)"  },
};

const typeConfig = {
  bug:     { label: "Bug",     icon: Bug,         color: "#ef4444" },
  feature: { label: "Feature", icon: Zap,         color: "#8b5cf6" },
  task:    { label: "Task",    icon: CheckSquare, color: "#3b82f6" },
};

const PAGE_SIZE = 10;

export default function Tasks() {
  const {
    tasks, members, sprints, updateTask, deleteTask, openTaskModal,
    searchQuery, setSearchQuery, smartSearch,
    filterStatus, filterPriority, filterType,
    setFilterStatus, setFilterPriority, setFilterType, clearFilters,
  } = useAppStore();

  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage]       = useState(1);

  const memberById = useMemo(() => {
    const m = new Map();
    for (const item of members) m.set(item.id, item);
    return m;
  }, [members]);

  const sprintById = useMemo(() => {
    const m = new Map();
    for (const item of sprints) m.set(item.id, item);
    return m;
  }, [sprints]);

  const q = (searchQuery || "").toLowerCase();
  const smartIds = useMemo(() => {
    if (!smartSearch || smartSearch.query !== searchQuery) return null;
    return new Set(smartSearch.results.map((task) => task.id));
  }, [smartSearch, searchQuery]);
  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        if (smartIds) return smartIds.has(t.id);
        const matchSearch =
          !q ||
          (t.title || "").toLowerCase().includes(q) ||
          (t.id || "").toLowerCase().includes(q) ||
          (t.tags || []).some((tag) => (tag || "").toLowerCase().includes(q)) ||
          (t.description || "").toLowerCase().includes(q);
        const matchStatus = filterStatus === "all" || t.status === filterStatus;
        const matchPriority = filterPriority === "all" || t.priority === filterPriority;
        const matchType = filterType === "all" || t.type === filterType;
        return matchSearch && matchStatus && matchPriority && matchType;
      })
      .sort((a, b) => {
        let av = a[sortKey] ?? "";
        let bv = b[sortKey] ?? "";
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
  }, [tasks, q, smartIds, filterStatus, filterPriority, filterType, sortKey, sortDir]);

  const totalPages = useMemo(() => Math.ceil(filtered.length / PAGE_SIZE), [filtered.length]);
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );


  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const clearAllFilters = () => {
    clearFilters();
    setPage(1);
  };



  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : <ChevronUp size={12} className="opacity-20" />;

  const getMember = (id) => memberById.get(id);
  const getSprint = (id) => sprintById.get(id);


  const hasActiveFilters = searchQuery || filterStatus !== "all" || filterPriority !== "all" || filterType !== "all";

  return (
    <div className="flex flex-col gap-4">

      {/* Filters bar */}
      <div className="bg-white rounded-2xl px-5 py-3.5 shadow-sm border border-gray-100 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex-shrink-0">Filters</span>

        {/* Status */}
        <select value={filterStatus} onChange={(e) => changeFilter(setFilterStatus)(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none bg-white text-gray-600 focus:border-indigo-400">
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>

        {/* Priority */}
        <select value={filterPriority} onChange={(e) => changeFilter(setFilterPriority)(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none bg-white text-gray-600 focus:border-indigo-400">
          <option value="all">All Priority</option>
          {Object.keys(priorityConfig).map((k) => <option key={k} value={k}>{priorityConfig[k].label}</option>)}
        </select>

        {/* Type */}
        <select value={filterType} onChange={(e) => changeFilter(setFilterType)(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs outline-none bg-white text-gray-600 focus:border-indigo-400">
          <option value="all">All Types</option>
          {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>

        {/* Active search pill */}
        {searchQuery && (
          <div className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 font-medium">
            "{searchQuery}"
            <button onClick={() => { setSearchQuery(""); setPage(1); }} className="hover:text-indigo-800">
              <X size={11} />
            </button>
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-400">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</span>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
              Clear all
            </button>
          )}
        </div>
      </div>

      {smartSearch && smartSearch.query === searchQuery && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-indigo-900">Smart search interpreted your query</p>
            <p className="text-xs text-indigo-700 mt-1">
              {Object.entries(smartSearch.interpreted).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(" | ") || "Semantic keyword match"}
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-700">{smartSearch.results.length} results</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-wrap">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[["id","ID"],["title","Title"],["type","Type"],["priority","Priority"],["status","Status"],["assigneeId","Assignee"],["sprintId","Sprint"],["dueDate","Due"],["storyPoints","SP"]].map(([k, label]) => (
                  <th key={k} onClick={() => handleSort(k)}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 select-none whitespace-nowrap">
                    <span className="flex items-center gap-1">{label}<SortIcon k={k} /></span>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((task) => {
                const tCfg   = typeConfig[task.type]    || typeConfig.task;
                const pCfg   = priorityConfig[task.priority] || priorityConfig.medium;
                const sCfg   = statusConfig[task.status]     || statusConfig.todo;
                const member = getMember(task.assigneeId);
                const sprint = getSprint(task.sprintId);
                const PIcon  = pCfg.icon;
                const TIcon  = tCfg.icon;

                return (
                  <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-all">
                    {/* ID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-500">{task.id}</span>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                      {task.tags?.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {task.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs w-fit font-medium" style={{ color: tCfg.color }}>
                        <TIcon size={12} />{tCfg.label}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit font-medium" style={{ color: pCfg.color, background: pCfg.bg }}>
                        <PIcon size={10} />{pCfg.label}
                      </span>
                    </td>

                    {/* Status — inline change */}
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value })}
                        className="text-xs px-2 py-1 rounded-full border-0 outline-none font-medium cursor-pointer"
                        style={{ color: sCfg.color, background: sCfg.bg }}
                      >
                        {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-3">
                      {member ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: member.color }}>
                            {member.initials}
                          </div>
                          <span className="text-xs text-gray-600">{member.name.split(" ")[0]}</span>
                        </div>
                      ) : (
                        <button onClick={() => openTaskModal(task)} className="text-xs text-indigo-400 hover:text-indigo-600">Assign</button>
                      )}
                    </td>

                    {/* Sprint */}
                    <td className="px-4 py-3">
                      {sprint
                        ? <span className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">{sprint.name}</span>
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {task.dueDate
                        ? <span className={`text-xs ${new Date(task.dueDate) < new Date() && task.status !== "done" ? "text-red-500 font-medium" : "text-gray-500"}`}>{task.dueDate}</span>
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>

                    {/* Story Points */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{task.storyPoints}pt</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openTaskModal(task)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-500 transition-all">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginated.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-400 mb-2">No tasks match your filters.</p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-xs text-indigo-500 hover:underline">Clear filters</button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">Page {page} of {totalPages} · {filtered.length} tasks</span>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${p === page ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
