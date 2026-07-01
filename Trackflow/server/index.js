const express    = require("express");
const Database   = require("better-sqlite3");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const cors       = require("cors");
const path       = require("path");
const http       = require("http");
const socketIo   = require("socket.io");
const multer     = require("multer");
const nodemailer = require("nodemailer");

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server, { cors: { origin: "http://localhost:5173" } });
const db     = new Database(path.join(__dirname, "db.sqlite"));
const SECRET = "trackflow_jwt_secret_2024";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Email setup (optional - gracefully handles if nodemailer fails)
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || 'demo@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'demo'
    }
  });
} catch (err) {
  console.warn('Email transport not configured:', err.message);
  transporter = null;
}

const sendEmail = async (to, subject, text) => {
  if (!transporter) {
    console.log('[EMAIL] (not configured) Would send to:', to, 'Subject:', subject);
    return;
  }
  try {
    await transporter.sendMail({ from: 'trackflow@demo.com', to, subject, text });
    console.log('Email sent to', to);
  } catch (err) {
    console.log('Email error:', err.message);
  }
};

// ── Create tables ──────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT, email TEXT UNIQUE, password TEXT,
    initials TEXT, color TEXT, role TEXT
  );

  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT, initials TEXT, color TEXT, role TEXT, email TEXT
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT, description TEXT, type TEXT,
    priority TEXT, status TEXT,
    assigneeId TEXT, sprintId TEXT,
    storyPoints INTEGER, createdAt TEXT, dueDate TEXT,
    tags TEXT, attachments TEXT
  );

  CREATE TABLE IF NOT EXISTS sprints (
    id TEXT PRIMARY KEY,
    name TEXT, goal TEXT, startDate TEXT,
    endDate TEXT, status TEXT, storyPoints INTEGER
  );

  CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    title TEXT, description TEXT,
    progress INTEGER, status TEXT,
    dueDate TEXT, linkedTasks INTEGER
  );

  CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  text TEXT,
  time TEXT,
  read INTEGER,
  type TEXT
);
`);

// ── Seed data (only if empty) ───────────────────────────────────
const seed = () => {
  if (db.prepare("SELECT COUNT(*) as c FROM users").get().c > 0) return;

  const users = [
    { id: "u1", name: "Sarah Chen",  email: "sarah@trackflow.io",  password: bcrypt.hashSync("demo123", 10), initials: "SC", color: "#3b82f6", role: "Product Lead"  },
    { id: "u2", name: "Alex Rivera", email: "alex@trackflow.io",   password: bcrypt.hashSync("demo123", 10), initials: "AR", color: "#8b5cf6", role: "Frontend Dev"  },
    { id: "u3", name: "Admin User",  email: "admin@trackflow.io",  password: bcrypt.hashSync("admin",   10), initials: "AU", color: "#ef4444", role: "Administrator" },
  ];
  const ins = db.prepare("INSERT INTO users VALUES (@id,@name,@email,@password,@initials,@color,@role)");
  users.forEach(u => ins.run(u));

  const members = [
    { id: "m1", name: "Sarah Chen",   initials: "SC", color: "#3b82f6", role: "Product Lead", email: "sarah@trackflow.io" },
    { id: "m2", name: "Alex Rivera",  initials: "AR", color: "#8b5cf6", role: "Frontend Dev", email: "alex@trackflow.io" },
    { id: "m3", name: "Jordan Kim",   initials: "JK", color: "#10b981", role: "Backend Dev",  email: "jordan@trackflow.io" },
    { id: "m4", name: "Morgan Lee",   initials: "ML", color: "#f59e0b", role: "QA Engineer",  email: "morgan@trackflow.io" },
    { id: "m5", name: "Casey Zhang",  initials: "CZ", color: "#14b8a6", role: "DevOps",       email: "casey@trackflow.io" },
    { id: "m6", name: "Taylor Swift", initials: "TS", color: "#ec4899", role: "UI Designer",  email: "taylor@trackflow.io" },
  ];
  const insMember = db.prepare("INSERT INTO members VALUES (@id,@name,@initials,@color,@role,@email)");
  members.forEach(m => insMember.run(m));

  const tasks = [
    { id:"TF-101", title:"Login page crashes on Safari",    description:"Users on Safari 16 get a blank screen after login.",           priority:"critical", status:"in-progress", assigneeId:"m4", sprintId:"s1", storyPoints:3,  type:"bug",     createdAt:"2024-01-10", dueDate:"2024-01-20", tags:"auth,safari"        },
    { id:"TF-102", title:"Add dark mode toggle",            description:"Implement system-wide dark mode using CSS variables.",          priority:"medium",   status:"todo",        assigneeId:"m2", sprintId:"s1", storyPoints:5,  type:"feature", createdAt:"2024-01-11", dueDate:"2024-01-25", tags:"ui,theme"           },
    { id:"TF-103", title:"API rate limiting",               description:"Implement rate limiting on all public endpoints.",              priority:"high",     status:"review",      assigneeId:"m3", sprintId:"s1", storyPoints:8,  type:"task",    createdAt:"2024-01-12", dueDate:"2024-01-22", tags:"api,security"       },
    { id:"TF-104", title:"Dashboard performance",           description:"Dashboard takes 4s to load. Optimize queries.",                 priority:"high",     status:"todo",        assigneeId:"m3", sprintId:"s1", storyPoints:5,  type:"bug",     createdAt:"2024-01-13", dueDate:"2024-01-28", tags:"performance"        },
    { id:"TF-105", title:"Onboarding flow redesign",        description:"Redesign the 3-step onboarding for new users.",                 priority:"medium",   status:"in-progress", assigneeId:"m6", sprintId:"s1", storyPoints:8,  type:"feature", createdAt:"2024-01-14", dueDate:"2024-01-30", tags:"ux,onboarding"      },
    { id:"TF-106", title:"Export to CSV",                   description:"Allow users to export task list as CSV.",                        priority:"low",      status:"done",        assigneeId:"m2", sprintId:"s1", storyPoints:3,  type:"feature", createdAt:"2024-01-08", dueDate:"2024-01-18", tags:"export"             },
    { id:"TF-107", title:"Fix notification duplicates",     description:"Notifications appear twice on page refresh.",                   priority:"high",     status:"done",        assigneeId:"m4", sprintId:"s1", storyPoints:2,  type:"bug",     createdAt:"2024-01-09", dueDate:"2024-01-17", tags:"notifications"      },
    { id:"TF-108", title:"Sprint velocity chart",           description:"Add velocity chart to reports page.",                           priority:"medium",   status:"done",        assigneeId:"m1", sprintId:"s1", storyPoints:5,  type:"feature", createdAt:"2024-01-07", dueDate:"2024-01-16", tags:"reports,charts"     },
    { id:"TF-109", title:"Role-based access control",       description:"Implement RBAC for admin, member, viewer roles.",               priority:"critical", status:"todo",        assigneeId:"m3", sprintId:"s2", storyPoints:13, type:"feature", createdAt:"2024-01-15", dueDate:"2024-02-05", tags:"auth,security"      },
    { id:"TF-110", title:"Mobile responsive layout",        description:"Make all pages fully responsive for mobile.",                   priority:"high",     status:"todo",        assigneeId:"m6", sprintId:"s2", storyPoints:8,  type:"task",    createdAt:"2024-01-16", dueDate:"2024-02-08", tags:"mobile,responsive"  },
    { id:"TF-111", title:"Email notification system",       description:"Send email alerts for task assignments and due dates.",         priority:"medium",   status:"in-progress", assigneeId:"m5", sprintId:"s2", storyPoints:5,  type:"feature", createdAt:"2024-01-17", dueDate:"2024-02-10", tags:"email,notifications"},
    { id:"TF-112", title:"CI/CD pipeline setup",            description:"Set up GitHub Actions for automated testing and deployment.",   priority:"high",     status:"in-progress", assigneeId:"m5", sprintId:"s2", storyPoints:8,  type:"task",    createdAt:"2024-01-18", dueDate:"2024-02-12", tags:"devops,ci-cd"       },
    { id:"TF-113", title:"Search indexing",                 description:"Implement full-text search across all tasks.",                  priority:"medium",   status:"backlog",     assigneeId:null, sprintId:null, storyPoints:8,  type:"feature", createdAt:"2024-01-19", dueDate:null,           tags:"search"             },
    { id:"TF-114", title:"Audit log",                       description:"Track all user actions for compliance.",                        priority:"low",      status:"backlog",     assigneeId:null, sprintId:null, storyPoints:5,  type:"task",    createdAt:"2024-01-20", dueDate:null,           tags:"compliance"         },
    { id:"TF-115", title:"Two-factor authentication",       description:"Add 2FA support via TOTP apps.",                               priority:"high",     status:"backlog",     assigneeId:null, sprintId:null, storyPoints:8,  type:"feature", createdAt:"2024-01-21", dueDate:null,           tags:"auth,security"      },
  ];
  const insTask = db.prepare("INSERT INTO tasks VALUES (@id,@title,@description,@type,@priority,@status,@assigneeId,@sprintId,@storyPoints,@createdAt,@dueDate,@tags,@attachments)");
  tasks.forEach(t => insTask.run({ ...t, attachments: "" }));

  const sprints = [
    { id:"s1", name:"Sprint 12", goal:"Stabilize core features and fix critical bugs", startDate:"2024-01-08", endDate:"2024-01-28", status:"active",    storyPoints:42 },
    { id:"s2", name:"Sprint 13", goal:"Security hardening and mobile responsiveness",  startDate:"2024-01-29", endDate:"2024-02-18", status:"planned",   storyPoints:34 },
    { id:"s3", name:"Sprint 11", goal:"Initial dashboard and reporting features",       startDate:"2023-12-18", endDate:"2024-01-07", status:"completed", storyPoints:38 },
  ];
  const insSprint = db.prepare("INSERT INTO sprints VALUES (@id,@name,@goal,@startDate,@endDate,@status,@storyPoints)");
  sprints.forEach(s => insSprint.run(s));

  const goals = [
    { id:"g1", title:"Ship v1.0 to production",    description:"Complete all critical features and deploy to prod.", progress:45, status:"on-track", dueDate:"2024-03-01", linkedTasks:8 },
    { id:"g2", title:"Zero critical bugs in prod",  description:"Resolve all P0/P1 bugs before next release.",        progress:70, status:"on-track", dueDate:"2024-02-15", linkedTasks:4 },
    { id:"g3", title:"Mobile-first experience",     description:"All pages fully responsive and tested on mobile.",   progress:20, status:"at-risk",  dueDate:"2024-02-28", linkedTasks:3 },
    { id:"g4", title:"Security compliance",         description:"RBAC, 2FA, audit logs all implemented.",             progress:15, status:"behind",   dueDate:"2024-03-15", linkedTasks:5 },
  ];
  const insGoal = db.prepare("INSERT INTO goals VALUES (@id,@title,@description,@progress,@status,@dueDate,@linkedTasks)");
  goals.forEach(g => insGoal.run(g));
};
seed();

// ── Auth middleware ─────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ── RBAC middleware ────────────────────────────────────────────
const requireRole = (role) => (req, res, next) => {
  const user = db.prepare("SELECT role FROM users WHERE id = ?").get(req.user.id);
  if (!user || user.role !== role) return res.status(403).json({ error: "Insufficient permissions" });
  next();
};

// ── Helper: parse tags ──────────────────────────────────────────
const parseTask = (t) => t ? { ...t, tags: t.tags ? t.tags.split(",").filter(Boolean) : [], attachments: t.attachments ? t.attachments.split(",").filter(Boolean) : [] } : null;

const getTasks = () => db.prepare("SELECT * FROM tasks").all().map(parseTask);
const getMembers = () => db.prepare("SELECT * FROM members").all();
const getSprints = () => db.prepare("SELECT * FROM sprints").all();
const activeStatuses = new Set(["todo", "in-progress", "review"]);
const priorityWeight = { low: 1, medium: 2, high: 3, critical: 5 };
const moduleKeywords = {
  authentication: ["auth", "login", "password", "session", "token", "rbac", "2fa"],
  frontend: ["ui", "safari", "mobile", "responsive", "layout", "theme", "dashboard"],
  backend: ["api", "query", "database", "rate", "endpoint", "server"],
  devops: ["ci", "cd", "pipeline", "deploy", "github", "build"],
  notifications: ["email", "notification", "alert"],
  reporting: ["report", "chart", "analytics", "export"],
};

const textOf = (task) => `${task.title || ""} ${task.description || ""} ${(task.tags || []).join(" ")}`.toLowerCase();
const words = (value) => new Set(String(value || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length > 2));
const similarity = (a, b) => {
  const aw = words(a);
  const bw = words(b);
  if (!aw.size || !bw.size) return 0;
  const shared = [...aw].filter((w) => bw.has(w)).length;
  return Math.round((shared / Math.max(aw.size, bw.size)) * 100);
};
const detectModules = (text) => Object.entries(moduleKeywords)
  .filter(([, keys]) => keys.some((key) => text.includes(key)))
  .map(([module]) => module);
const estimatePoints = (task) => {
  const text = textOf(task);
  let points = task.storyPoints || 3;
  if (text.includes("rbac") || text.includes("authentication") || text.includes("pipeline")) points += 5;
  if (text.includes("api") || text.includes("database") || text.includes("security")) points += 3;
  if (task.priority === "critical") points += 3;
  if (task.type === "bug") points -= 1;
  return Math.max(1, Math.min(13, points));
};
const workload = (tasks, members) => members.map((member) => {
  const assigned = tasks.filter((t) => t.assigneeId === member.id && activeStatuses.has(t.status));
  const points = assigned.reduce((sum, task) => sum + (task.storyPoints || estimatePoints(task)), 0);
  return { ...member, activeTasks: assigned.length, activePoints: points, capacity: member.role === "Product Lead" ? 10 : 16 };
});
const sprintRisk = (sprintId) => {
  const tasks = getTasks();
  const members = getMembers();
  const sprints = getSprints();
  const sprint = sprints.find((s) => s.id === sprintId) || sprints.find((s) => s.status === "active") || sprints[0];
  const sprintTasks = sprint ? tasks.filter((t) => t.sprintId === sprint.id) : [];
  const totalPoints = sprintTasks.reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  const donePoints = sprintTasks.filter((t) => t.status === "done").reduce((sum, task) => sum + (task.storyPoints || 0), 0);
  const blocked = sprintTasks.filter((t) => t.priority === "critical" && t.status !== "done");
  const teamLoad = workload(sprintTasks, members);
  const overloaded = teamLoad.filter((m) => m.activePoints > m.capacity);
  const completion = totalPoints ? Math.round((donePoints / totalPoints) * 100) : 0;
  const riskPenalty = blocked.length * 12 + overloaded.length * 10 + Math.max(0, totalPoints - (sprint?.storyPoints || totalPoints)) * 2;
  const confidence = Math.max(10, Math.min(95, completion + 45 - riskPenalty));
  return {
    sprint,
    confidence,
    healthScore: Math.max(1, Math.round(confidence / 10)),
    status: confidence >= 75 ? "On track" : confidence >= 50 ? "Watch" : "At risk",
    blockers: blocked.map((t) => ({ id: t.id, title: t.title, priority: t.priority })),
    overloaded: overloaded.map((m) => ({ id: m.id, name: m.name, activePoints: m.activePoints, capacity: m.capacity })),
    redistribution: overloaded.map((m) => {
      const receiver = teamLoad.filter((x) => x.id !== m.id).sort((a, b) => a.activePoints - b.activePoints)[0];
      return receiver ? `Move 3-5 points from ${m.name} to ${receiver.name} to reduce delivery risk.` : `Reduce scope for ${m.name}.`;
    }),
  };
};
const buildInsights = () => {
  const tasks = getTasks();
  const members = getMembers();
  const sprints = getSprints();
  const activeSprint = sprints.find((s) => s.status === "active") || sprints[0];
  const risk = sprintRisk(activeSprint?.id);
  const bugs = tasks.filter((t) => t.type === "bug");
  const openBugs = bugs.filter((t) => t.status !== "done");
  const completed = tasks.filter((t) => t.status === "done");
  const velocity = sprints.map((s) => {
    const sprintTasks = tasks.filter((t) => t.sprintId === s.id);
    return {
      sprint: s.name,
      committed: s.storyPoints || sprintTasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0),
      completed: sprintTasks.filter((t) => t.status === "done").reduce((sum, t) => sum + (t.storyPoints || 0), 0),
    };
  });
  const teamLoad = workload(tasks, members);
  const balanceScore = Math.max(1, 100 - Math.round(Math.max(...teamLoad.map((m) => m.activePoints), 0) * 4));
  return {
    sprintHealthScore: risk.healthScore,
    deliveryConfidence: risk.confidence,
    workloadBalance: balanceScore,
    velocityPrediction: Math.round((velocity.reduce((sum, v) => sum + v.completed, 0) / Math.max(velocity.length, 1)) || 0),
    bugTrend: {
      open: openBugs.length,
      resolved: bugs.length - openBugs.length,
      criticalOpen: openBugs.filter((t) => t.priority === "critical").length,
    },
    risk,
    velocity,
    workload: teamLoad,
    criticalRisks: [
      ...risk.blockers.map((t) => `Critical blocker ${t.id}: ${t.title}`),
      ...risk.overloaded.map((m) => `${m.name} is over capacity (${m.activePoints}/${m.capacity} pts)`),
      ...(openBugs.length > completed.length / 2 ? ["Bug inflow is high relative to completed work"] : []),
    ].slice(0, 5),
  };
};

// Helper to emit task updates
const emitTaskUpdate = (event, task) => {
  io.emit(event, task);
};

// Helper to emit notification updates
const emitNotification = (notification) => {
  io.emit('notificationCreated', notification);
};

// ══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: "Invalid email or password. Try demo credentials below." });
  const { password: _, ...safeUser } = user;
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "7d" });
  res.json({ token, user: safeUser });
});

app.get("/api/auth/me", auth, (req, res) => {
  const user = db.prepare("SELECT id,name,email,initials,color,role FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

// ══════════════════════════════════════════════════════════════
// MEMBERS
// ══════════════════════════════════════════════════════════════
app.get("/api/members", auth, (req, res) => {
  res.json(db.prepare("SELECT * FROM members").all());
});

// ══════════════════════════════════════════════════════════════
// TASKS
// ══════════════════════════════════════════════════════════════
app.get("/api/tasks", auth, (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all().map(parseTask);
  res.json(tasks);
});

app.post("/api/tasks", auth, (req, res) => {
  const { title, description, type, priority, status, assigneeId, sprintId, storyPoints, dueDate, tags } = req.body;
  const id = `TF-${Date.now()}`;
  const createdAt = new Date().toISOString().split("T")[0];
  const tagsStr = Array.isArray(tags) ? tags.join(",") : (tags || "");
  db.prepare("INSERT INTO tasks VALUES (@id,@title,@description,@type,@priority,@status,@assigneeId,@sprintId,@storyPoints,@createdAt,@dueDate,@tags,@attachments)")
    .run({ id, title, description, type, priority, status, assigneeId: assigneeId||null, sprintId: sprintId||null, storyPoints: storyPoints||0, createdAt, dueDate: dueDate||null, tags: tagsStr, attachments: "" });
  const task = parseTask(db.prepare("SELECT * FROM tasks WHERE id = ?").get(id));
  const notifId = `n${Date.now()}`;

db.prepare(`
  INSERT INTO notifications
  (id, text, time, read, type)
  VALUES (?, ?, ?, ?, ?)
`).run(
  notifId,
  `New task created: ${task.title}`,
  "just now",
  0,
  "assign"
);
  const notification = {
    id: notifId,
    text: `New task created: ${task.title}`,
    time: "just now",
    read: false,
    type: "assign",
  };
  emitNotification(notification);
  emitTaskUpdate('taskCreated', task);
  if (assigneeId) {
    const member = db.prepare("SELECT email FROM members WHERE id = ?").get(assigneeId);
    if (member && member.email) {
      sendEmail(member.email, `New Task Assigned: ${task.title}`, `You have been assigned a new task: ${task.title}. Description: ${task.description}`);
    }
  }
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", auth, (req, res) => {
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  const updated = { ...task, ...req.body, tags: Array.isArray(req.body.tags) ? req.body.tags.join(",") : (req.body.tags ?? task.tags), attachments: Array.isArray(req.body.attachments) ? req.body.attachments.join(",") : (req.body.attachments ?? task.attachments) };
  db.prepare("UPDATE tasks SET title=@title,description=@description,type=@type,priority=@priority,status=@status,assigneeId=@assigneeId,sprintId=@sprintId,storyPoints=@storyPoints,dueDate=@dueDate,tags=@tags,attachments=@attachments WHERE id=@id")
    .run(updated);
  const newTask = parseTask(db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id));
  emitTaskUpdate('taskUpdated', newTask);
  res.json(newTask);
});

app.delete("/api/tasks/:id", auth, requireRole('Administrator'), (req, res) => {
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);
  emitTaskUpdate('taskDeleted', { id: req.params.id });
  res.json({ ok: true });
});

app.post("/api/tasks/:id/upload", auth, upload.single('file'), (req, res) => {
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  const attachments = task.attachments ? task.attachments.split(",").filter(Boolean) : [];
  attachments.push(req.file.filename);
  db.prepare("UPDATE tasks SET attachments = ? WHERE id = ?").run(attachments.join(","), req.params.id);
  res.json({ filename: req.file.filename });
});

// ══════════════════════════════════════════════════════════════
// SPRINTS
// ══════════════════════════════════════════════════════════════
app.get("/api/sprints", auth, (req, res) => {
  res.json(db.prepare("SELECT * FROM sprints").all());
});

app.post("/api/sprints", auth, (req, res) => {
  const { name, goal, startDate, endDate, status, storyPoints } = req.body;
  const id = `s${Date.now()}`;
  db.prepare("INSERT INTO sprints VALUES (@id,@name,@goal,@startDate,@endDate,@status,@storyPoints)")
    .run({ id, name, goal: goal||"", startDate: startDate||"", endDate: endDate||"", status: status||"planned", storyPoints: storyPoints||0 });
  res.status(201).json(db.prepare("SELECT * FROM sprints WHERE id = ?").get(id));
});

app.patch("/api/sprints/:id", auth, (req, res) => {
  const sprint = db.prepare("SELECT * FROM sprints WHERE id = ?").get(req.params.id);
  if (!sprint) return res.status(404).json({ error: "Sprint not found" });
  const updated = { ...sprint, ...req.body };
  db.prepare("UPDATE sprints SET name=@name,goal=@goal,startDate=@startDate,endDate=@endDate,status=@status,storyPoints=@storyPoints WHERE id=@id")
    .run(updated);
  res.json(db.prepare("SELECT * FROM sprints WHERE id = ?").get(req.params.id));
});

// ══════════════════════════════════════════════════════════════
// GOALS
// ══════════════════════════════════════════════════════════════
app.get("/api/goals", auth, (req, res) => {
  res.json(db.prepare("SELECT * FROM goals").all());
});

app.post("/api/goals", auth, (req, res) => {
  const { title, description, dueDate, linkedTasks, progress, status } = req.body;
  const id = `g${Date.now()}`;
  db.prepare("INSERT INTO goals VALUES (@id,@title,@description,@progress,@status,@dueDate,@linkedTasks)")
    .run({ id, title, description: description||"", progress: progress||0, status: status||"on-track", dueDate: dueDate||"", linkedTasks: linkedTasks||0 });
  res.status(201).json(db.prepare("SELECT * FROM goals WHERE id = ?").get(id));
});

app.patch("/api/goals/:id", auth, (req, res) => {
  const goal = db.prepare("SELECT * FROM goals WHERE id = ?").get(req.params.id);
  if (!goal) return res.status(404).json({ error: "Goal not found" });
  const updated = { ...goal, ...req.body };
  db.prepare("UPDATE goals SET title=@title,description=@description,progress=@progress,status=@status,dueDate=@dueDate,linkedTasks=@linkedTasks WHERE id=@id")
    .run(updated);
  res.json(db.prepare("SELECT * FROM goals WHERE id = ?").get(req.params.id));
});



// Notifications for real-time updates
app.get("/api/notifications", auth, (req, res) => {
  const notifications = db
    .prepare("SELECT * FROM notifications ORDER BY id DESC")
    .all();

  res.json(notifications);
});



// ── Socket.io for real-time updates ───────────────────────────
// AI intelligence routes. These deterministic heuristics make the product useful
// without external infrastructure and can later be swapped for an LLM provider.
app.get("/api/ai/insights", auth, (req, res) => {
  res.json(buildInsights());
});

app.post("/api/ai/duplicates", auth, (req, res) => {
  const candidateText = `${req.body.title || ""} ${req.body.description || ""} ${(req.body.tags || []).join(" ")}`;
  const matches = getTasks()
    .filter((task) => (req.body.type || "bug") === "bug" ? task.type === "bug" : true)
    .map((task) => ({ task, score: similarity(candidateText, textOf(task)) }))
    .filter((item) => item.score >= 25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  res.json({
    duplicateRisk: matches[0]?.score || 0,
    matches: matches.map(({ task, score }) => ({ id: task.id, title: task.title, status: task.status, score })),
  });
});

app.post("/api/ai/bug-assistant", auth, (req, res) => {
  const text = `${req.body.title || ""} ${req.body.description || ""}`.toLowerCase();
  const affectedModules = detectModules(text);
  const severity = text.includes("crash") || text.includes("blank") || text.includes("data loss")
    ? "critical"
    : text.includes("slow") || text.includes("timeout") || text.includes("security") ? "high" : "medium";
  const rootCauses = [
    text.includes("safari") ? "Browser-specific rendering or storage API incompatibility" : null,
    text.includes("login") || text.includes("token") ? "Session token refresh, route guard, or auth state race condition" : null,
    text.includes("duplicate") ? "Idempotency gap in event handling or websocket reconciliation" : null,
    text.includes("slow") || text.includes("performance") ? "Unbounded query, missing index, or unnecessary client re-render" : null,
  ].filter(Boolean);
  res.json({
    severity,
    affectedModules: affectedModules.length ? affectedModules : ["frontend", "backend"],
    likelyRootCauses: rootCauses.length ? rootCauses : ["Recent change near the reported workflow", "Unhandled edge state in async request flow"],
    debuggingSteps: [
      "Reproduce with the same browser, role, and dataset reported by the customer.",
      "Check client console, API status codes, and websocket events for the same timestamp.",
      "Bisect recent changes touching the affected module and add a regression test before closing.",
    ],
    recommendedTags: [...new Set([...(affectedModules || []), severity])].slice(0, 4),
  });
});

app.post("/api/ai/task-breakdown", auth, (req, res) => {
  const base = req.body.title || "New capability";
  const text = `${base} ${req.body.description || ""}`.toLowerCase();
  const modules = detectModules(text);
  res.json({
    storyPoints: estimatePoints(req.body),
    subtasks: [
      { area: "Frontend", title: `Build user workflow for ${base}`, points: 3 },
      { area: "Backend", title: `Expose API and validation for ${base}`, points: 3 },
      { area: "Testing", title: `Add regression and acceptance coverage for ${base}`, points: 2 },
      { area: "DevOps", title: `Prepare rollout and observability for ${base}`, points: modules.includes("devops") ? 3 : 1 },
      { area: "Documentation", title: "Document behavior, edge cases, and release impact", points: 1 },
    ],
    acceptanceCriteria: [
      "Primary workflow succeeds for the happy path and empty/error states.",
      "Permissions, validation, and audit-sensitive paths are covered.",
      "Feature ships with measurable success signal and rollback notes.",
    ],
  });
});

app.post("/api/ai/sprint-plan", auth, (req, res) => {
  const tasks = getTasks();
  const members = getMembers();
  const capacity = members.reduce((sum, member) => sum + (member.role === "Product Lead" ? 6 : 12), 0);
  const backlog = tasks
    .filter((t) => t.status === "backlog" || !t.sprintId)
    .map((t) => ({ ...t, suggestedPoints: estimatePoints(t), modules: detectModules(textOf(t)) }))
    .sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
  let used = 0;
  const recommended = [];
  for (const task of backlog) {
    if (used + task.suggestedPoints <= capacity) {
      recommended.push(task);
      used += task.suggestedPoints;
    }
  }
  res.json({
    capacity,
    committedPoints: used,
    confidence: Math.round((used / Math.max(capacity, 1)) * 100),
    recommendedTasks: recommended.map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      suggestedPoints: t.suggestedPoints,
      dependencies: backlog.filter((x) => x.id !== t.id && x.modules.some((m) => t.modules.includes(m))).slice(0, 2).map((x) => x.id),
    })),
    rationale: "Prioritized critical/high backlog items, module dependencies, and team capacity.",
  });
});

app.post("/api/ai/sprint-risk", auth, (req, res) => {
  res.json(sprintRisk(req.body.sprintId));
});

app.post("/api/ai/release-notes", auth, (req, res) => {
  const completed = getTasks().filter((t) => t.status === "done");
  res.json({
    title: req.body.title || "TrackFlow Engineering Release",
    summary: `${completed.length} completed items across product quality, platform reliability, and delivery workflows.`,
    sections: {
      features: completed.filter((t) => t.type === "feature").map((t) => t.title),
      fixes: completed.filter((t) => t.type === "bug").map((t) => t.title),
      improvements: completed.filter((t) => t.type === "task").map((t) => t.title),
    },
  });
});

app.post("/api/ai/meeting-summary", auth, (req, res) => {
  const tasks = getTasks().filter((t) => t.status !== "done").slice(0, 8);
  res.json({
    summary: "The team is focused on closing active sprint work, reducing critical bugs, and keeping security/mobile initiatives moving.",
    decisions: tasks.filter((t) => t.priority === "critical" || t.priority === "high").slice(0, 3).map((t) => `Prioritize ${t.id}: ${t.title}`),
    actionItems: tasks.slice(0, 5).map((t) => ({ ownerTask: t.id, action: `Confirm next step and unblock ${t.title}` })),
  });
});

app.post("/api/ai/search", auth, (req, res) => {
  const query = String(req.body.query || "").toLowerCase();
  const member = getMembers().find((m) => query.includes(m.name.toLowerCase()) || query.includes(m.name.split(" ")[0].toLowerCase()));
  const module = Object.keys(moduleKeywords).find((name) => query.includes(name));
  const type = ["bug", "feature", "task"].find((item) => query.includes(item));
  const status = ["backlog", "todo", "in-progress", "review", "done"].find((item) => query.includes(item.replace("-", " "))) || null;
  const results = getTasks().filter((task) => {
    if (member && task.assigneeId !== member.id) return false;
    if (type && task.type !== type) return false;
    if (status && task.status !== status) return false;
    if (module && !textOf(task).includes(module) && !detectModules(textOf(task)).includes(module)) return false;
    return !query || similarity(query, textOf(task)) > 0 || Boolean(member || type || status || module);
  });
  res.json({ query, interpreted: { member: member?.name, module, type, status }, results });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3005, () => console.log("TrackFlow API running on http://localhost:3005"));
