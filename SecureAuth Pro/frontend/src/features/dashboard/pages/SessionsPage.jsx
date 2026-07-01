import React from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { getAccessTokenFromStorage } from '../../../utils/tokenStorage'
import { apiGetSessions, apiRevokeSession, apiRevokeAllSessions } from '../../../services/authApi'
import { Spinner } from '../../../ui/feedback/Spinner'
import { EmptyState } from '../../../ui/feedback/EmptyState'
import { SkeletonRow } from '../../../ui/feedback/Skeleton'
import { timeAgo, formatDate } from '../../../utils/eventMeta'

const DEVICE_ICON = { Mobile: '📱', Tablet: '📟', Desktop: '💻' }

export function SessionsPage() {
  const [sessions, setSessions] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [revoking, setRevoking] = React.useState(null)
  const navigate = useNavigate()

  async function load() {
    setLoading(true)
    try {
      const data = await apiGetSessions({ accessToken: getAccessTokenFromStorage() })
      setSessions(data.sessions || [])
    } catch {
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { load() }, [])

  async function revoke(sessionId) {
    setRevoking(sessionId)
    try {
      await apiRevokeSession({ accessToken: getAccessTokenFromStorage(), sessionId })
      toast.success('Session revoked')
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    } catch {
      toast.error('Failed to revoke session')
    } finally {
      setRevoking(null)
    }
  }

  async function revokeAll() {
    if (!confirm('This will log you out of all devices. Continue?')) return
    try {
      await apiRevokeAllSessions({ accessToken: getAccessTokenFromStorage() })
      toast.success('All sessions revoked')
      navigate('/login')
    } catch {
      toast.error('Failed to revoke all sessions')
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Active Sessions</h1>
          <p className="text-sm text-slate-500 mt-1">Devices currently signed in to your account.</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={revokeAll}
            className="text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
          >
            Revoke all
          </button>
        )}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {loading && (
          <div className="divide-y">
            {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="p-6">
            <EmptyState title="No active sessions" description="Sessions appear here after login." />
          </div>
        )}

        {!loading && sessions.map((s) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
            <div className="text-2xl">{DEVICE_ICON[s.device] || '💻'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{s.browser} on {s.os}</span>
                {s.isCurrent && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    Current
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {s.ip || 'Unknown IP'} · Last active {timeAgo(s.lastActivityAt)}
              </div>
              <div className="text-xs text-slate-400">Signed in {formatDate(s.createdAt)}</div>
            </div>
            {!s.isCurrent && (
              <button
                onClick={() => revoke(s.id)}
                disabled={revoking === s.id}
                className="text-xs text-red-600 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {revoking === s.id ? <Spinner size={14} /> : 'Revoke'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
