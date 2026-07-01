import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../state/useAuth'
import { EmptyState } from '../../../ui/feedback/EmptyState'
import { StatCard } from '../../../ui/data/StatCard'
import { SkeletonCard } from '../../../ui/feedback/Skeleton'
import { apiGetSecurityInsights } from '../../../services/authApi'
import { getAccessTokenFromStorage } from '../../../utils/tokenStorage'
import { timeAgo } from '../../../utils/eventMeta'

const QUICK_LINKS = [
  { label: 'Active Sessions', desc: 'See where you\'re signed in', to: '/sessions', icon: '🖥' },
  { label: 'Security Center', desc: 'Review your security score', to: '/security', icon: '🛡' },
  { label: 'Change Password', desc: 'Update your credentials', to: '/settings', icon: '🔑' },
  { label: 'Profile', desc: 'Edit your display name', to: '/profile', icon: '👤' }
]

export function DashboardPage() {
  const { user, isReady, isAuthenticated } = useAuth()
  const [insights, setInsights] = React.useState(null)

  React.useEffect(() => {
    if (!isAuthenticated) return
    apiGetSecurityInsights({ accessToken: getAccessTokenFromStorage() })
      .then(setInsights)
      .catch(() => {})
  }, [isAuthenticated])

  if (!isReady) {
    return (
      <div className="space-y-4 max-w-4xl">
        <SkeletonCard />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <EmptyState title="No session" description="Login to access your dashboard." />
  }

  const passwordAgeDays = insights?.passwordAgeDays
  const score = insights?.score

  return (
    <div className="max-w-4xl space-y-6">
      {/* Welcome */}
      <div className="rounded-xl border bg-white p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Welcome back</div>
          <div className="text-xl font-bold mt-0.5">{user.email}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{user.role}</span>
            {user.emailVerified
              ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">✓ Verified</span>
              : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⚠ Unverified</span>
            }
          </div>
        </div>
        {score !== undefined && (
          <div className="text-center hidden sm:block">
            <div className={`text-3xl font-bold ${score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
              {score}
            </div>
            <div className="text-xs text-slate-400">Security Score</div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {!user.emailVerified && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-amber-900 text-sm">Email not verified</div>
            <div className="text-xs text-amber-700 mt-0.5">Verify your email to secure your account.</div>
          </div>
          <Link to="/verify-email" className="text-xs bg-amber-900 text-white px-3 py-1.5 rounded-lg hover:bg-amber-800">
            Verify
          </Link>
        </div>
      )}

      {passwordAgeDays !== null && passwordAgeDays > 90 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-red-900 text-sm">Password expiry reminder</div>
            <div className="text-xs text-red-700 mt-0.5">Your password is {passwordAgeDays} days old. Consider updating it.</div>
          </div>
          <Link to="/settings" className="text-xs bg-red-900 text-white px-3 py-1.5 rounded-lg hover:bg-red-800">
            Update
          </Link>
        </div>
      )}

      {/* Stats */}
      {insights && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Security Score" value={insights.score} accent={insights.score >= 80 ? 'green' : insights.score >= 50 ? 'amber' : 'red'} />
          <StatCard label="Active Sessions" value={insights.activeSessions} accent="blue" />
          <StatCard label="Failed Logins" value={insights.failedLoginAttempts} sub="30 days" accent={insights.failedLoginAttempts > 3 ? 'red' : 'slate'} />
          <StatCard label="Password Age" value={passwordAgeDays !== null ? `${passwordAgeDays}d` : '—'} accent={passwordAgeDays !== null && passwordAgeDays < 90 ? 'green' : 'amber'} />
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="flex items-center gap-4 rounded-xl border bg-white p-4 hover:bg-slate-50 transition-colors group"
          >
            <span className="text-2xl">{l.icon}</span>
            <div>
              <div className="font-medium text-sm group-hover:text-slate-900">{l.label}</div>
              <div className="text-xs text-slate-500">{l.desc}</div>
            </div>
            <span className="ml-auto text-slate-300 group-hover:text-slate-500">→</span>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      {insights?.recentActivity?.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b font-semibold text-sm flex items-center justify-between">
            Recent Activity
            <Link to="/security" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {insights.recentActivity.slice(0, 5).map((a, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 border-b last:border-0 text-sm">
              <span className="text-slate-600">{a.browser} · {a.os}</span>
              <span className="text-xs text-slate-400 ml-auto">{timeAgo(a.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
