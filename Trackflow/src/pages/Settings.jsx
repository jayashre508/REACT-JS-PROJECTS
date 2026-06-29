import { useState } from "react";
import { User, Building2, Bell, Palette, Shield, Trash2, Camera, Check, Moon, Sun, Monitor, Save, LogOut, Key, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useAppStore from "../store/useAppStore";
import useThemeStore from "../store/useThemeStore";

const tabs = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "workspace",     label: "Workspace",     icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance",    label: "Appearance",    icon: Palette },
  { id: "security",      label: "Security",      icon: Shield },
];

const themes = [
  { id: "light",  label: "Light",  icon: Sun },
  { id: "dark",   label: "Dark",   icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

const accentColors = [
  { id: "blue",   color: "#3b82f6", label: "Blue" },
  { id: "violet", color: "#8b5cf6", label: "Violet" },
  { id: "emerald",color: "#10b981", label: "Emerald" },
  { id: "rose",   color: "#f43f5e", label: "Rose" },
  { id: "amber",  color: "#f59e0b", label: "Amber" },
  { id: "teal",   color: "#14b8a6", label: "Teal" },
];

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-3 py-4 border-b border-gray-50 last:border-0">
      <div className="sm:w-48 flex-shrink-0">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-all flex-shrink-0 ${checked ? "bg-blue-500" : "bg-gray-200"}`}
      style={{ height: "22px", width: "40px" }}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

// ── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const { currentUser, updateProfile } = useAuthStore();
  const [name, setName]   = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [role, setRole]   = useState(currentUser?.role || "");
  const [bio, setBio]     = useState(currentUser?.bio || "");
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateProfile({ name, email, role, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      <Section title="Personal Information" subtitle="Update your name, email and profile details">

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-50">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ background: `linear-gradient(135deg, ${currentUser?.color}, ${currentUser?.color}99)` }}>
              {currentUser?.initials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm hover:bg-blue-700 transition-all">
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{currentUser?.name}</p>
            <p className="text-xs text-gray-400">{currentUser?.role}</p>
            <p className="text-xs text-blue-500 mt-1 cursor-pointer hover:underline">Change avatar</p>
          </div>
        </div>

        <Field label="Full Name" hint="Your display name across the workspace">
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
        </Field>

        <Field label="Email Address" hint="Used for login and notifications">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
        </Field>

        <Field label="Role / Title" hint="Your role in the team">
          <input value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all" />
        </Field>

        <Field label="Bio" hint="Short description about yourself">
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Tell your team a bit about yourself..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all resize-none" />
        </Field>
      </Section>

      <div className="flex justify-end">
        <button onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${saved ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

// ── Workspace Tab ────────────────────────────────────────────────────────────
function WorkspaceTab() {
  const { tasks, members, sprints } = useAppStore();
  const [wsName, setWsName] = useState("TrackFlow Workspace");
  const [saved, setSaved]   = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <Section title="Workspace Settings" subtitle="Configure your team workspace">
        <Field label="Workspace Name">
          <input value={wsName} onChange={(e) => setWsName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all" />
        </Field>
        <Field label="Workspace URL" hint="Your unique workspace identifier">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">trackflow.io/</span>
            <input defaultValue="my-workspace" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all" />
          </div>
        </Field>
        <Field label="Default Priority" hint="Default priority for new tasks">
          <select className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 bg-white">
            <option>Medium</option><option>Low</option><option>High</option><option>Critical</option>
          </select>
        </Field>
      </Section>

      {/* Stats */}
      <Section title="Workspace Stats" subtitle="Overview of your current workspace">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Tasks",  value: tasks.length,   color: "#3b82f6" },
            { label: "Team Members", value: members.length, color: "#8b5cf6" },
            { label: "Sprints",      value: sprints.length, color: "#10b981" },
            { label: "Completed",    value: tasks.filter(t => t.status === "done").length, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="flex justify-end">
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

// ── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    taskAssigned: true, taskDue: true, taskCompleted: false,
    sprintStart: true, sprintEnd: true, comments: true,
    emailDigest: false, browserPush: true, slackIntegration: false,
  });
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const groups = [
    { title: "Task Notifications", items: [
      { key: "taskAssigned",  label: "Task assigned to me",    hint: "When someone assigns a task to you" },
      { key: "taskDue",       label: "Task due reminders",     hint: "24h before a task is due" },
      { key: "taskCompleted", label: "Task completed",         hint: "When a task you created is completed" },
      { key: "comments",      label: "Comments & mentions",    hint: "When someone comments on your tasks" },
    ]},
    { title: "Sprint Notifications", items: [
      { key: "sprintStart", label: "Sprint started",  hint: "When a new sprint begins" },
      { key: "sprintEnd",   label: "Sprint ending",   hint: "3 days before sprint ends" },
    ]},
    { title: "Delivery Channels", items: [
      { key: "emailDigest",      label: "Daily email digest",    hint: "Summary of activity every morning" },
      { key: "browserPush",      label: "Browser notifications", hint: "Push notifications in your browser" },
      { key: "slackIntegration", label: "Slack integration",     hint: "Send notifications to Slack channel" },
    ]},
  ];

  return (
    <div className="flex flex-col gap-5">
      {groups.map((g) => (
        <Section key={g.title} title={g.title}>
          {g.items.map((item) => (
            <Field key={item.key} label={item.label} hint={item.hint}>
              <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
            </Field>
          ))}
        </Section>
      ))}
    </div>
  );
}

// ── Appearance Tab ───────────────────────────────────────────────────────────
function AppearanceTab() {
  const { dark, toggleDark } = useThemeStore();
  const [accent, setAccent]   = useState("blue");
  const [density, setDensity] = useState("comfortable");
  const [saved, setSaved]     = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <Section title="Theme" subtitle="Choose how TrackFlow looks for you">
        <div className="flex gap-3 flex-wrap">
          {themes.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === "system" ? false : (t.id === "dark") === dark;
            return (
              <button key={t.id} onClick={() => { if (t.id !== "system") { if ((t.id === "dark") !== dark) toggleDark(); } }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${isActive ? "border-indigo-400 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                <Icon size={15} />{t.label}
                {isActive && <Check size={13} className="text-indigo-500" />}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Accent Color" subtitle="Personalize your workspace color">
        <div className="flex gap-3 flex-wrap">
          {accentColors.map((c) => (
            <button key={c.id} onClick={() => setAccent(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${accent === c.id ? "border-gray-400 bg-gray-50" : "border-gray-100 hover:border-gray-200"}`}>
              <span className="w-4 h-4 rounded-full" style={{ background: c.color }} />
              {c.label}
              {accent === c.id && <Check size={11} className="text-gray-600" />}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Display Density" subtitle="Control how compact the UI feels">
        <div className="flex gap-3 flex-wrap">
          {["compact", "comfortable", "spacious"].map((d) => (
            <button key={d} onClick={() => setDensity(d)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${density === d ? "border-blue-400 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {d}
            </button>
          ))}
        </div>
      </Section>

      <div className="flex justify-end">
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

// ── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const { logout } = useAuthStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [twoFA, setTwoFA]             = useState(false);
  const [sessions] = useState([
    { device: "Chrome on macOS",  location: "Mumbai, IN",    time: "Active now",  current: true },
    { device: "Safari on iPhone", location: "Mumbai, IN",    time: "2 hours ago", current: false },
    { device: "Firefox on Windows",location: "Delhi, IN",   time: "3 days ago",  current: false },
  ]);

  return (
    <div className="flex flex-col gap-5">
      <Section title="Change Password" subtitle="Use a strong password to keep your account secure">
        <Field label="Current Password">
          <div className="relative">
            <input type={showCurrent ? "text" : "password"} placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all pr-10" />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <Field label="New Password">
          <div className="relative">
            <input type={showNew ? "text" : "password"} placeholder="Min. 8 characters"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all pr-10" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <div className="pt-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all">
            <Key size={14} /> Update Password
          </button>
        </div>
      </Section>

      <Section title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account">
        <Field label="Enable 2FA" hint="Require a verification code on login">
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </Field>
        {twoFA && (
          <div className="mt-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-700">
            ✓ Two-factor authentication is enabled. Use an authenticator app like Google Authenticator.
          </div>
        )}
      </Section>

      <Section title="Active Sessions" subtitle="Manage devices where you're logged in">
        <div className="flex flex-col gap-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.current ? "bg-emerald-400" : "bg-gray-300"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">{s.device}</p>
                  <p className="text-xs text-gray-400">{s.location} · {s.time}</p>
                </div>
              </div>
              {s.current
                ? <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">Current</span>
                : <button className="text-xs text-red-500 hover:underline">Revoke</button>}
            </div>
          ))}
        </div>
      </Section>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-50 bg-red-50/50">
          <p className="text-sm font-bold text-red-700 flex items-center gap-2"><Trash2 size={14} /> Danger Zone</p>
          <p className="text-xs text-red-400 mt-0.5">These actions are irreversible. Please be careful.</p>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Sign out of all devices</p>
              <p className="text-xs text-gray-400 mt-0.5">Revoke all active sessions except this one</p>
            </div>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-all">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
              <p className="text-sm font-semibold text-gray-800">Delete account</p>
              <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all data</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all">
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings ────────────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabContent = {
    profile:       <ProfileTab />,
    workspace:     <WorkspaceTab />,
    notifications: <NotificationsTab />,
    appearance:    <AppearanceTab />,
    security:      <SecurityTab />,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">

      {/* Sidebar tabs */}
      <div className="lg:w-52 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
                <Icon size={16} className={isActive ? "text-blue-500" : "text-gray-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}
