const BASE = "/api";

const getToken = () => localStorage.getItem("tf_token");

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("tf_token");
      localStorage.removeItem("tf_user");
      window.dispatchEvent(new Event("tf-auth-invalid"));
    }
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export const api = {
  login:        (email, password) => request("POST",   "/auth/login",    { email, password }),
  me:           ()                => request("GET",    "/auth/me"),

  getTasks:     ()                => request("GET",    "/tasks"),
  createTask:   (task)            => request("POST",   "/tasks",         task),
  updateTask:   (id, updates)     => request("PATCH",  `/tasks/${id}`,   updates),
  deleteTask:   (id)              => request("DELETE", `/tasks/${id}`),

  getSprints:   ()                => request("GET",    "/sprints"),
  createSprint: (sprint)          => request("POST",   "/sprints",       sprint),
  updateSprint: (id, updates)     => request("PATCH",  `/sprints/${id}`, updates),

  getGoals:     ()                => request("GET",    "/goals"),
  createGoal:   (goal)            => request("POST",   "/goals",         goal),
  updateGoal:   (id, updates)     => request("PATCH",  `/goals/${id}`,   updates),

  getMembers:   ()                => request("GET",    "/members"), 
  getNotifications: ()            => request("GET",    "/notifications"),

  getAiInsights:      ()              => request("GET",  "/ai/insights"),
  generateSprintPlan: (payload = {})  => request("POST", "/ai/sprint-plan", payload),
  predictSprintRisk:  (sprintId)      => request("POST", "/ai/sprint-risk", { sprintId }),
  analyzeBug:         (payload)       => request("POST", "/ai/bug-assistant", payload),
  findDuplicates:     (payload)       => request("POST", "/ai/duplicates", payload),
  breakdownTask:      (payload)       => request("POST", "/ai/task-breakdown", payload),
  generateReleaseNotes:(payload = {}) => request("POST", "/ai/release-notes", payload),
  summarizeMeeting:   (payload = {})  => request("POST", "/ai/meeting-summary", payload),
  smartSearch:        (query)         => request("POST", "/ai/search", { query }),

};
