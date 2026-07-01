import { create } from "zustand";
import { api } from "../lib/api";
import socket from "../lib/socket";

const useAppStore = create((set) => {
  socket.off("taskCreated").on("taskCreated", (task) => {
    set((s) => ({
      tasks: s.tasks.some((t) => t.id === task.id)
        ? s.tasks.map((t) => (t.id === task.id ? task : t))
        : [task, ...s.tasks],
    }));
  });

  socket.off("taskUpdated").on("taskUpdated", (task) => {
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === task.id ? task : t)) }));
  });

  socket.off("taskDeleted").on("taskDeleted", ({ id }) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  });

  socket.off("notificationCreated").on("notificationCreated", (notification) => {
    set((s) => ({
      notifications: s.notifications.some((n) => n.id === notification.id)
        ? s.notifications
        : [notification, ...s.notifications],
    }));
  });

  return {
    tasks:         [],
    members:       [],
    sprints:       [],
    goals:         [],
    notifications: [],
    aiInsights:    null,
    smartSearch:   null,

  // loading & error per resource
  loading: { tasks: false, sprints: false, goals: false, members: false, ai: false },
  error:   { tasks: null,  sprints: null,  goals: null,  members: null, ai: null  },

  taskModalOpen:  false,
  editingTask:    null,
  notifPanelOpen: false,
  searchQuery:    "",
  filterStatus:   "all",
  filterPriority: "all",
  filterType:     "all",

  // ── Fetch all data on app load ──────────────────────────────
  fetchAll: async () => {
    const setLoading = (k, v) => set((s) => ({ loading: { ...s.loading, [k]: v } }));
    const setError   = (k, v) => set((s) => ({ error:   { ...s.error,   [k]: v } }));

    setLoading("tasks",   true);
    setLoading("sprints", true);
    setLoading("goals",   true);
    setLoading("members", true);

    const [tasks, sprints, goals, members, notifications] = await Promise.allSettled([
      api.getTasks(), api.getSprints(), api.getGoals(), api.getMembers(), api.getNotifications(),
    ]);

    if (tasks.status   === "fulfilled") { set({ tasks:   tasks.value   }); setLoading("tasks",   false); }
    else { setError("tasks",   tasks.reason.message);   setLoading("tasks",   false); }

    if (sprints.status === "fulfilled") { set({ sprints: sprints.value }); setLoading("sprints", false); }
    else { setError("sprints", sprints.reason.message); setLoading("sprints", false); }

    if (goals.status   === "fulfilled") { set({ goals:   goals.value   }); setLoading("goals",   false); }
    else { setError("goals",   goals.reason.message);   setLoading("goals",   false); }

    if (members.status === "fulfilled") { set({ members: members.value }); setLoading("members", false); }
    else { setError("members", members.reason.message); setLoading("members", false); }

    if (notifications.status === "fulfilled") { set({ notifications: notifications.value }); }
  },


  // Notifications
  fetchNotifications: async () => {
  const notifications = await api.getNotifications();

  set({
    notifications,
  });
},

  fetchAiInsights: async () => {
    set((s) => ({ loading: { ...s.loading, ai: true }, error: { ...s.error, ai: null } }));
    try {
      const aiInsights = await api.getAiInsights();
      set((s) => ({ aiInsights, loading: { ...s.loading, ai: false } }));
    } catch (err) {
      set((s) => ({ error: { ...s.error, ai: err.message }, loading: { ...s.loading, ai: false } }));
    }
  },

  runSmartSearch: async (query) => {
    const smartSearch = await api.smartSearch(query);
    set({ smartSearch, searchQuery: query });
    return smartSearch;
  },



  // ── Tasks ───────────────────────────────────────────────────
  addTask: async (task) => {
    const created = await api.createTask(task);
    set((s) => ({
      tasks: [created, ...s.tasks],
    }));
  },

  updateTask: async (id, updates) => {
    const updated = await api.updateTask(id, updates);
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? updated : t)) }));
  },

  deleteTask: async (id) => {
    await api.deleteTask(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
  },

  moveTask: async (taskId, newStatus) => {
    const updated = await api.updateTask(taskId, { status: newStatus });
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? updated : t)),
      notifications: [
        { id: `n${Date.now()}`, text: `${taskId} moved to ${newStatus}`, time: "just now", read: false, type: "status" },
        ...s.notifications,
      ],
    }));
  },

  // ── Sprints ─────────────────────────────────────────────────
  addSprint: async (sprint) => {
    const created = await api.createSprint(sprint);
    set((s) => ({ sprints: [...s.sprints, created] }));
  },

  updateSprint: async (id, updates) => {
    const updated = await api.updateSprint(id, updates);
    set((s) => ({ sprints: s.sprints.map((sp) => (sp.id === id ? updated : sp)) }));
  },

  // ── Goals ───────────────────────────────────────────────────
  addGoal: async (goal) => {
    const created = await api.createGoal(goal);
    set((s) => ({ goals: [...s.goals, created] }));
  },

  updateGoal: async (id, updates) => {
    const updated = await api.updateGoal(id, updates);
    set((s) => ({ goals: s.goals.map((g) => (g.id === id ? updated : g)) }));
  },

  // ── Modal ───────────────────────────────────────────────────
  openTaskModal:  (task = null) => set({ taskModalOpen: true, editingTask: task }),
  closeTaskModal: ()            => set({ taskModalOpen: false, editingTask: null }),

  // ── Notifications ───────────────────────────────────────────
  toggleNotifPanel: () => set((s) => ({ notifPanelOpen: !s.notifPanelOpen })),
  markAllRead:      () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  dismissNotif:     (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  // ── Filters ─────────────────────────────────────────────────
  setSearchQuery:   (q) => set({ searchQuery: q }),
  setFilterStatus:  (v) => set({ filterStatus: v }),
  setFilterPriority:(v) => set({ filterPriority: v }),
  setFilterType:    (v) => set({ filterType: v }),
  clearFilters:     ()  => set({ searchQuery: "", filterStatus: "all", filterPriority: "all", filterType: "all" })
  };
});

export default useAppStore;
