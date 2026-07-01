import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/useAuth'

const ALL_COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', path: '/dashboard', roles: ['admin', 'user'] },
  { id: 'sessions', label: 'Active Sessions', path: '/sessions', roles: ['admin', 'user'] },
  { id: 'security', label: 'Security Center', path: '/security', roles: ['admin', 'user'] },
  { id: 'profile', label: 'Profile Settings', path: '/profile', roles: ['admin', 'user'] },
  { id: 'settings', label: 'Change Password', path: '/settings', roles: ['admin', 'user'] },
  { id: 'admin', label: 'Admin Dashboard', path: '/admin', roles: ['admin'] }
]

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = React.useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  const inputRef = React.useRef(null)

  const commands = ALL_COMMANDS.filter(
    (c) =>
      (!user || c.roles.includes(user.role)) &&
      c.label.toLowerCase().includes(query.toLowerCase())
  )

  React.useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  function go(path) {
    navigate(path)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <span className="text-slate-400">⌘</span>
          <input
            ref={inputRef}
            className="flex-1 outline-none text-sm text-slate-900 placeholder:text-slate-400"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="text-xs text-slate-400 border rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto py-2">
          {commands.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-400">No commands found</li>
          )}
          {commands.map((c) => (
            <li key={c.id}>
              <button
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 transition-colors"
                onClick={() => go(c.path)}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2 border-t text-xs text-slate-400">
          Press <kbd className="border rounded px-1">↑↓</kbd> to navigate · <kbd className="border rounded px-1">Enter</kbd> to select
        </div>
      </div>
    </div>
  )
}
