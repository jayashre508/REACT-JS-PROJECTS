import { api } from './apiClient'
import { getCsrfTokenFromCookie } from './csrf'

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function apiRegister({ email, password }) {
  const res = await api.post('/auth/register', { email, password })
  return res.data
}

export async function apiLogin({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  return res.data
}

export async function apiLogout() {
  const res = await api.post('/auth/logout')
  return res.data
}

export async function apiForgotPassword({ email }) {
  const res = await api.post('/auth/forgot-password', { email })
  return res.data
}

export async function apiResetPassword({ token, newPassword }) {
  const res = await api.post('/auth/reset-password', { token, newPassword })
  return res.data
}

export async function apiVerifyEmail({ token }) {
  const res = await api.post('/auth/verify-email', { token })
  return res.data
}

export async function apiRefresh() {
  const res = await api.post('/auth/refresh')
  return res.data
}

export async function apiMe() {
  const { getAccessTokenFromStorage } = await import('../utils/tokenStorage')
  const accessToken = getAccessTokenFromStorage()
  if (!accessToken) {
    const err = new Error('No access token')
    err.status = 401
    throw err
  }
  const res = await api.get('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

export async function apiUpdateProfile({ accessToken, displayName }) {
  const csrf = getCsrfTokenFromCookie()
  const res = await api.put('/auth/profile', { displayName }, { headers: { Authorization: `Bearer ${accessToken}`, 'x-csrf-token': csrf } })
  return res.data
}

export async function apiChangePassword({ accessToken, currentPassword, newPassword }) {
  const csrf = getCsrfTokenFromCookie()
  const res = await api.put(
    '/auth/change-password',
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${accessToken}`, 'x-csrf-token': csrf } }
  )
  return res.data
}

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function apiGetSessions({ accessToken }) {
  const res = await api.get('/auth/sessions', { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

export async function apiRevokeSession({ accessToken, sessionId }) {
  const res = await api.delete(`/auth/sessions/${sessionId}`, { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

export async function apiRevokeAllSessions({ accessToken }) {
  const res = await api.delete('/auth/sessions', { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

// ── Security Insights ─────────────────────────────────────────────────────────

export async function apiGetSecurityInsights({ accessToken }) {
  const res = await api.get('/auth/security-insights', { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function apiAdminListUsers({ accessToken }) {
  const res = await api.get('/admin/users', { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

export async function apiAdminUpdateUserRole({ accessToken, userId, role }) {
  const res = await api.patch(`/admin/users/${userId}/role`, { role }, { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

export async function apiAdminUnlockUser({ accessToken, userId }) {
  const res = await api.patch(`/admin/users/${userId}/unlock`, {}, { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

export async function apiAdminDashboard({ accessToken }) {
  const res = await api.get('/admin/dashboard', { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}

export async function apiAdminAuditLogs({ accessToken, page = 1, event = '' }) {
  const params = new URLSearchParams({ page, limit: 20 })
  if (event) params.set('event', event)
  const res = await api.get(`/admin/audit-logs?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } })
  return res.data
}
