import React from 'react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { getAccessTokenFromStorage } from '../../../utils/tokenStorage'
import { apiGetSecurityInsights } from '../../../services/authApi'
import { SkeletonCard } from '../../../ui/feedback/Skeleton'
import { StatCard } from '../../../ui/data/StatCard'
import { eventLabel, eventColor, timeAgo } from '../../../utils/eventMeta'

function ScoreRing({ score }) {
  const color = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  const label = score >= 80 ? 'Strong' : score >= 50 ? 'Fair' : 'At Risk'
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className={`text-6xl font-bold ${color}`}>{score}</div>
      <div className={`text-sm font-medium mt-1 ${color}`}>{label}</div>
      <div className="text-xs text-slate-400 mt-1">Security Score</div>
    </div>
  )
}

function Check({ ok, label, action, to }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <span className={`text-lg ${ok ? 'text-emerald-500' : 'text-red-400'}`}>{ok ? '✓' : '✗'}</span>
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      {!ok && to && (
        <Link to={to} className="text-xs text-blue-600 hover:underline">{action}</Link>
      )}
    </div>
  )
}

export function SecurityCenterPage() {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function load() {
      try {
        const res = await apiGetSecurityInsights({ accessToken: getAccessTokenFromStorage() })
        setData(res)
      } catch {
        toast.error('Failed to load security insights')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <SkeletonCard />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  if (!data) return null

  const passwordOk = data.passwordAgeDays !== null && data.passwordAgeDays < 90

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security Center</h1>
        <p className="text-sm text-slate-500 mt-1">Your account security overview.</p>
      </div>

      <div className="bg-white border rounded-xl flex flex-col sm:flex-row items-center">
        <ScoreRing score={data.score} />
        <div className="flex-1 px-6 py-4 border-t sm:border-t-0 sm:border-l w-full">
          <div className="font-semibold text-sm mb-3">Security Checklist</div>
          <Check ok={data.emailVerified} label="Email verified" action="Verify now" to="/verify-email" />
          <Check ok={passwordOk} label={passwordOk ? `Password updated ${data.passwordAgeDays}d ago` : 'Password is older than 90 days'} action="Change password" to="/settings" />
          <Check ok={data.failedLoginAttempts === 0} label={data.failedLoginAttempts === 0 ? 'No failed login attempts' : `${data.failedLoginAttempts} failed attempts (30 days)`} />
          <Check ok={data.newDeviceLogins === 0} label={data.newDeviceLogins === 0 ? 'No new device logins' : `${data.newDeviceLogins} new device login(s) detected`} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Security Score" value={data.score} accent={data.score >= 80 ? 'green' : data.score >= 50 ? 'amber' : 'red'} />
        <StatCard label="Active Sessions" value={data.activeSessions} sub="devices signed in" accent="blue" />
        <StatCard label="Failed Logins" value={data.failedLoginAttempts} sub="last 30 days" accent={data.failedLoginAttempts > 3 ? 'red' : 'slate'} />
        <StatCard label="Password Age" value={data.passwordAgeDays !== null ? `${data.passwordAgeDays}d` : 'Never set'} accent={passwordOk ? 'green' : 'amber'} />
      </div>

      {data.newDeviceLogins > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="font-semibold text-amber-900 text-sm">⚠ New device login detected</div>
          <p className="text-xs text-amber-800 mt-1">
            Your account was accessed from a new device recently. If this wasn't you,{' '}
            <Link to="/sessions" className="underline">revoke the session</Link>.
          </p>
        </div>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b font-semibold text-sm">Recent Activity</div>
        {data.recentActivity.length === 0 && (
          <div className="px-5 py-4 text-sm text-slate-400">No recent activity.</div>
        )}
        {data.recentActivity.map((a, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3 border-b last:border-0 hover:bg-slate-50">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eventColor(a.event)}`}>
              {eventLabel(a.event)}
            </span>
            <span className="text-xs text-slate-500">{a.browser} · {a.os}</span>
            <span className="text-xs text-slate-400 ml-auto">{timeAgo(a.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
