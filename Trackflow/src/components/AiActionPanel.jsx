import { Sparkles } from "lucide-react";

export default function AiActionPanel({ title, subtitle, action, onAction, loading, children }) {
  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-gradient-to-r from-indigo-50 to-sky-50">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-indigo-600" />
            <p className="text-sm font-bold text-gray-900">{title}</p>
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action && (
          <button
            type="button"
            onClick={onAction}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Thinking..." : action}
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
