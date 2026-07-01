import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/useAuth'
import { toast } from 'sonner'
import { apiLogout } from '../../services/authApi'
import { CommandPalette } from '../overlay/CommandPalette'

export function NavBar() {
  const { user, isAuthenticated, refetchMe } = useAuth()
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = React.useState(false)

  React.useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function onLogout() {
    try {
      await apiLogout()
      await refetchMe()
      navigate('/login')
      toast.success('Logged out')
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Logout failed')
    }
  }

  return (
    <>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="font-bold text-slate-900 hover:text-slate-700">
              🔐 SecureID
            </Link>
            {isAuthenticated && (
              <nav className="hidden sm:flex items-center gap-1 text-sm">
                <Link className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" to="/dashboard">Dashboard</Link>
                <Link className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" to="/sessions">Sessions</Link>
                <Link className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" to="/security">Security</Link>
                {user?.role === 'admin' && (
                  <Link className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors" to="/admin">Admin</Link>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                title="Open command palette (Ctrl+K)"
              >
                <span>Search</span>
                <kbd className="bg-slate-100 rounded px-1">⌘K</kbd>
              </button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                    {user?.email?.[0]?.toUpperCase()}
                  </span>
                </Link>
                <button
                  onClick={onLogout}
                  className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5" to="/login">Login</Link>
                <Link className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
