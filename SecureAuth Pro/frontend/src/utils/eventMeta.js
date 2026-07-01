export const EVENT_META = {
  login_success:             { label: 'Login',                color: 'bg-emerald-100 text-emerald-800' },
  login_failed:              { label: 'Failed login',         color: 'bg-red-100 text-red-800' },
  logout:                    { label: 'Logout',               color: 'bg-slate-100 text-slate-700' },
  register:                  { label: 'Registered',           color: 'bg-blue-100 text-blue-800' },
  password_changed:          { label: 'Password changed',     color: 'bg-purple-100 text-purple-800' },
  password_reset_requested:  { label: 'Reset requested',      color: 'bg-amber-100 text-amber-800' },
  password_reset_completed:  { label: 'Password reset',       color: 'bg-amber-100 text-amber-800' },
  email_verified:            { label: 'Email verified',       color: 'bg-teal-100 text-teal-800' },
  session_revoked:           { label: 'Session revoked',      color: 'bg-orange-100 text-orange-800' },
  role_changed:              { label: 'Role changed',         color: 'bg-indigo-100 text-indigo-800' },
  new_device_login:          { label: 'New device',           color: 'bg-yellow-100 text-yellow-800' }
}

export function eventLabel(event) {
  return EVENT_META[event]?.label ?? event
}

export function eventColor(event) {
  return EVENT_META[event]?.color ?? 'bg-slate-100 text-slate-700'
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
