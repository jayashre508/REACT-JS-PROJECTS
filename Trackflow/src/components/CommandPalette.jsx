import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, FileText, ListChecks, Plus, Search, Sparkles, X } from "lucide-react";
import { api } from "../lib/api";
import useAppStore from "../store/useAppStore";

export default function CommandPalette() {
  const navigate = useNavigate();
  const { openTaskModal, runSmartSearch } = useAppStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState(null);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands = useMemo(() => [
    { label: "Create task", detail: "Open the intelligent task composer", icon: Plus, run: () => openTaskModal() },
    { label: "Plan sprint", detail: "Go to AI sprint planning", icon: Sparkles, run: () => navigate("/backlog") },
    { label: "Review sprint risk", detail: "Open predictive sprint health", icon: ListChecks, run: () => navigate("/sprints") },
    {
      label: "Generate release notes",
      detail: "Draft customer-ready notes from completed work",
      icon: FileText,
      run: async () => setOutput(await api.generateReleaseNotes()),
    },
    {
      label: "Summarize meeting",
      detail: "Create decisions and action items from active work",
      icon: Command,
      run: async () => setOutput(await api.summarizeMeeting()),
    },
  ], [navigate, openTaskModal]);

  const matches = commands.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.detail.toLowerCase().includes(query.toLowerCase()));

  const runSearch = async () => {
    if (!query.trim()) return;
    await runSmartSearch(query.trim());
    navigate("/list");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-20">
      <button className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close command palette" />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden anim-scale-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search size={16} className="text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") runSearch();
            }}
            placeholder='Search or ask: "Show all authentication bugs assigned to Alex"'
            className="flex-1 border-0 outline-none text-sm bg-transparent text-gray-800"
          />
          <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>

        <div className="p-2">
          {query.trim() && (
            <button onClick={runSearch} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-indigo-50 text-left transition-all">
              <Search size={16} className="text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Smart search</p>
                <p className="text-xs text-gray-500">{query}</p>
              </div>
            </button>
          )}
          {matches.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={async () => {
                  await item.run();
                  if (!["Generate release notes", "Summarize meeting"].includes(item.label)) setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left transition-all"
              >
                <Icon size={16} className="text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
              </button>
            );
          })}
        </div>

        {output && (
          <div className="border-t border-gray-100 bg-gray-50 p-4 max-h-72 overflow-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Generated output</p>
            <pre className="text-xs whitespace-pre-wrap text-gray-700 font-sans">{JSON.stringify(output, null, 2)}</pre>
          </div>
        )}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-400">
          Shortcut: Ctrl+J opens commands. Enter runs smart search.
        </div>
      </div>
    </div>
  );
}
