import React from 'react'
import { toast } from 'sonner'
import { getAccessTokenFromStorage } from '../../../utils/tokenStorage'
import {
  apiAdminListUsers, apiAdminUpdateUserRole, apiAdminUnlockUser,
  apiAdminDashboard, apiAdminAuditLogs
} from '../../../services/authApi'
import { Spinner } from '../../../ui/feedback/Spinner'
import { EmptyState } from '../../../ui/feedback/EmptyState'
import { SkeletonCard, SkeletonRow } from '../../../ui/feedback/Skeleton'
import { StatCard } from '../../../ui/data/StatCard'
import { eventLabel, eventColor, formatDate, timeAgo } from '../../../utils/eventMeta'

const TABS = ['Overview', 'Users', 'Audit Log']

export function AdminPage() {
  const [tab, setTab] = React.useState('Overview')
  const [stats, setStats] = React.useState(null)
  const [users, setUsers] = React.useState([])
  const [auditLogs, setAuditLogs] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [auditPage, setAuditPage] = React.useState(1)
  const [auditTotal, setAuditTotal] = React.useState(0)

  const token = getAccessTokenFromStorage()

  async function loadOverview() {
    setLoading(true)
    try {
      const data = await apiAdminDashboard({ accessToken: token })
      setStats(data)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await apiAdminListUsers({ accessToken: token })
      setUsers(data?.users || [])
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function loadAuditLogs(page = 1) {
    setLoading(true)
    try {
      const data = await apiAdminAuditLogs({ accessToken: token, page })
      setAuditLogs(data.logs || [])
      setAuditTotal(data.total || 0)
      setAuditPage(page)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (tab === 'Overview') loadOverview()
    else if (tab === 'Users') loadUsers()
    else if (tab === 'Audit Log') loadAuditLogs(1)
  }, [tab])

  async function updateRole(userId, role) {
    try {
      await apiAdminUpdateUserRole({ accessToken: token, userId, role })
      toast.success('Role updated')
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)))
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Update failed')
    }
  }

  async function unlock(userId) {
    try {
      await apiAdminUnlockUser({ accessToken: token, userId })
      toast.success('User unlocked')
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, lockedUntil: null, failedLoginAttempts: 0 } : u))
    } catch {
      toast.error('Failed to unlock user')
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Platform security and user management.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'Overview' && (
        <>
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          )}
          {!loading && stats && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={stats.stats.totalUsers} accent="blue" />
                <StatCard label="Verified" value={stats.stats.verifiedUsers} accent="green" />
                <StatCard label="Locked Accounts" value={stats.stats.lockedUsers} accent={stats.stats.lockedUsers > 0 ? 'red' : 'slate'} />
                <StatCard label="Active Sessions" value={stats.stats.activeSessions} accent="slate" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard label="Failed Logins (30d)" value={stats.stats.failedLoginsLast30Days} accent={stats.stats.failedLoginsLast30Days > 10 ? 'red' : 'amber'} />
                <StatCard label="Failed Logins (7d)" value={stats.stats.failedLoginsLast7Days} accent={stats.stats.failedLoginsLast7Days > 5 ? 'red' : 'slate'} />
              </div>

              {/* Recent users */}
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b font-semibold text-sm">Recently Registered</div>
                {stats.recentUsers.length === 0
                  ? <div className="p-5"><EmptyState title="No recent users" /></div>
                  : stats.recentUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0 text-sm">
                      <span className="font-mono text-xs flex-1">{u.email}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{u.role}</span>
                      <span className="text-xs text-slate-400">{timeAgo(u.createdAt)}</span>
                    </div>
                  ))
                }
              </div>

              {/* Recent audit logs */}
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b font-semibold text-sm">Recent Security Events</div>
                {stats.recentAuditLogs.map((l) => (
                  <div key={l.id} className="flex items-center gap-3 px-5 py-3 border-b last:border-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eventColor(l.event)}`}>
                      {eventLabel(l.event)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex-1 truncate">{l.email || '—'}</span>
                    <span className="text-xs text-slate-400">{timeAgo(l.createdAt)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Users Tab */}
      {tab === 'Users' && (
        <>
          {loading && <div className="space-y-1">{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</div>}
          {!loading && users.length === 0 && <EmptyState title="No users" />}
          {!loading && users.length > 0 && (
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-xs text-slate-500 bg-slate-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-left px-4 py-3">Role</th>
                      <th className="text-left px-4 py-3">Verified</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Joined</th>
                      <th className="text-left px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isLocked = u.lockedUntil && new Date(u.lockedUntil) > new Date()
                      return (
                        <tr key={u._id} className="border-t hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                          <td className="px-4 py-3">
                            <select
                              className="rounded border border-slate-300 px-2 py-1 text-xs"
                              value={u.role}
                              onChange={(e) => updateRole(u._id, e.target.value)}
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            {u.emailVerifiedAt
                              ? <span className="text-xs text-emerald-600">✓ Yes</span>
                              : <span className="text-xs text-slate-400">No</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            {isLocked
                              ? <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Locked</span>
                              : <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Active</span>
                            }
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(u.createdAt)}</td>
                          <td className="px-4 py-3">
                            {isLocked && (
                              <button
                                onClick={() => unlock(u._id)}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Unlock
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Audit Log Tab */}
      {tab === 'Audit Log' && (
        <>
          {loading && <div className="space-y-1">{[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}</div>}
          {!loading && auditLogs.length === 0 && <EmptyState title="No audit logs" />}
          {!loading && auditLogs.length > 0 && (
            <>
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-xs text-slate-500 bg-slate-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3">Event</th>
                        <th className="text-left px-4 py-3">Email</th>
                        <th className="text-left px-4 py-3">Browser / OS</th>
                        <th className="text-left px-4 py-3">IP</th>
                        <th className="text-left px-4 py-3">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((l) => (
                        <tr key={l.id} className="border-t hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eventColor(l.event)}`}>
                              {eventLabel(l.event)}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">{l.email || '—'}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{l.browser} · {l.os}</td>
                          <td className="px-4 py-3 text-xs text-slate-400 font-mono">{l.ip || '—'}</td>
                          <td className="px-4 py-3 text-xs text-slate-400">{formatDate(l.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{auditTotal} total events</span>
                <div className="flex gap-2">
                  <button
                    disabled={auditPage <= 1}
                    onClick={() => loadAuditLogs(auditPage - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-slate-50"
                  >
                    ← Prev
                  </button>
                  <span className="px-3 py-1">Page {auditPage}</span>
                  <button
                    disabled={auditPage * 20 >= auditTotal}
                    onClick={() => loadAuditLogs(auditPage + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-slate-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
