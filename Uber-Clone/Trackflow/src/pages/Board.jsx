import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MoreHorizontal, AlertCircle, ArrowUp, Minus, ArrowDown, Bug, Zap, CheckSquare, Search } from "lucide-react";
import useAppStore from "../store/useAppStore";

const columns = [
  { id: "todo",        label: "To Do",       color: "#3b82f6", bg: "#eff6ff" },
  { id: "in-progress", label: "In Progress", color: "#f59e0b", bg: "#fffbeb" },
  { id: "review",      label: "Review",      color: "#8b5cf6", bg: "#f5f3ff" },
  { id: "done",        label: "Done",        color: "#10b981", bg: "#f0fdf4" },
];

const priorityConfig = {
  critical: { label: "Critical", color: "#ef4444", bg: "#fff1f2", icon: AlertCircle },
  high:     { label: "High",     color: "#f97316", bg: "#fff7ed", icon: ArrowUp },
  medium:   { label: "Medium",   color: "#3b82f6", bg: "#eff6ff", icon: Minus },
  low:      { label: "Low",      color: "#94a3b8", bg: "#f8fafc", icon: ArrowDown },
};

const typeConfig = {
  bug:     { icon: Bug,          color: "#ef4444" },
  feature: { icon: Zap,          color: "#8b5cf6" },
  task:    { icon: CheckSquare,  color: "#3b82f6" },
};

function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || priorityConfig.medium;
  const Icon = cfg.icon;
  return (
    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: cfg.color, background: cfg.bg }}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function Avatar({ memberId, members, size = 6 }) {
  const m = members.find((x) => x.id === memberId);
  if (!m) return null;
  return (
    <div title={m.name} className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`} style={{ background: m.color, width: size * 4, height: size * 4, fontSize: 10 }}>
      {m.initials}
    </div>
  );
}

function TaskCard({ task, members, onEdit, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const TypeIcon = typeConfig[task.type]?.icon || CheckSquare;
  const typeColor = typeConfig[task.type]?.color || "#3b82f6";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={overlay ? {} : style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <TypeIcon size={13} style={{ color: typeColor }} />
          <span className="text-xs text-gray-400 font-mono">{task.id}</span>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onEdit(task); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-800 leading-snug mb-2">{task.title}</p>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{tag}</span>
          ))}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-1">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-2">
          {task.storyPoints && (
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{task.storyPoints}pt</span>
          )}
          <Avatar memberId={task.assigneeId} members={members} size={6} />
        </div>
      </div>
    </div>
  );
}

function Column({ col, tasks, members, onEdit, onAddTask }) {
  const { setNodeRef } = useSortable({ id: col.id });
  return (
    <div ref={setNodeRef} className="flex flex-col w-72 flex-shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
          <span className="text-sm font-semibold text-gray-700">{col.label}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ color: col.color, background: col.bg }}>
            {tasks.length}
          </span>
        </div>
        <button onClick={() => onAddTask(col.id)} className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 transition-all">
          <Plus size={14} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 min-h-24">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} members={members} onEdit={onEdit} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function Board() {
  const { tasks, members, moveTask, openTaskModal, searchQuery } = useAppStore();
  const [activeTask, setActiveTask] = useState(null);
  const [localFilter, setLocalFilter] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const q = (localFilter || searchQuery).toLowerCase();
  const boardTasks = tasks
    .filter((t) => t.status !== "backlog")
    .filter((t) => !q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q)));

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t.id === active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const newStatus = columns.find((c) => c.id === over.id)?.id || over.id;
    const task = tasks.find((t) => t.id === active.id);
    if (task && task.status !== newStatus && columns.find((c) => c.id === newStatus)) {
      moveTask(active.id, newStatus);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Sprint 12 Board</h2>
          <p className="text-xs text-gray-400 mt-0.5">Drag tasks between columns to update status</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Board search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white">
            <Search size={13} className="text-gray-400" />
            <input
              value={localFilter}
              onChange={(e) => setLocalFilter(e.target.value)}
              placeholder="Filter cards..."
              className="text-xs outline-none bg-transparent text-gray-700 w-28"
            />
          </div>
          {columns.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ color: c.color, background: c.bg }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
              {boardTasks.filter((t) => t.status === c.id).length} {c.label}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="board-scroll flex gap-4">
          {columns.map((col) => (
            <Column
              key={col.id}
              col={col}
              tasks={boardTasks.filter((t) => t.status === col.id)}
              members={members}
              onEdit={(task) => openTaskModal(task)}
              onAddTask={(status) => openTaskModal({ status })}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 scale-105">
              <TaskCard task={activeTask} members={members} onEdit={() => {}} overlay />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
