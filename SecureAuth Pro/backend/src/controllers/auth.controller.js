const bcrypt = require('bcrypt')
const { ApiError } = require('../utils/ApiError')
const { User } = require('../models/User')
const { Session } = require('../models/Session')
const { AuditLog } = require('../models/AuditLog')
const { asyncHandler } = require('../utils/asyncHandler')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../services/tokenService')
const {
  createTokenId,
  registerTokenId,
  isTokenIdValid,
  revokeTokenId,
  markReplaced,
  persistSession,
  touchSession
} = require('../services/refreshTokenStore')
const { sendVerificationEmail, verifyEmailToken } = require('../services/emailMockService')
const { logEvent } = require('../services/auditLogService')
const { nanoid } = require('nanoid')

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

function setAuthCookies({ res, refreshToken }) {
  const cookieDomain = process.env.COOKIE_DOMAIN
  const cookieSecure = process.env.COOKIE_SECURE === 'true'
  const sameSite = process.env.COOKIE_SAMESITE || 'Lax'

  const csrfToken = nanoid(24)
  res.cookie('XSRF-TOKEN', csrfToken, {
    httpOnly: false,
    secure: cookieSecure,
    sameSite,
    domain: cookieDomain === 'localhost' ? undefined : cookieDomain
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: cookieSecure,
    sameSite,
    domain: cookieDomain === 'localhost' ? undefined : cookieDomain,
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  return { csrfToken }
}

function clearAuthCookies(res) {
  res.clearCookie('refreshToken')
  res.clearCookie('XSRF-TOKEN')
}

const register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) return next(new ApiError({ statusCode: 409, message: 'Email already in use' }))

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, passwordHash, role: 'user', passwordHistory: [passwordHash] })

  const verification = await sendVerificationEmail({ userId: user._id })
  await logEvent({ event: 'register', userId: user._id, email, req })

  return res.status(201).json({
    message: 'User registered. Verify email using the provided mock token.',
    verificationToken: verification.token
  })
})

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    await logEvent({ event: 'login_failed', email, req, meta: { reason: 'user_not_found' } })
    return next(new ApiError({ statusCode: 401, message: 'Invalid credentials' }))
  }

  // Check lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remaining = Math.ceil((user.lockedUntil - Date.now()) / 60000)
    return next(new ApiError({ statusCode: 423, message: `Account locked. Try again in ${remaining} minute(s).` }))
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)
      user.failedLoginAttempts = 0
    }
    await user.save()
    await logEvent({ event: 'login_failed', userId: user._id, email, req, meta: { reason: 'wrong_password', attempts: user.failedLoginAttempts } })
    return next(new ApiError({ statusCode: 401, message: 'Invalid credentials' }))
  }

  if (!user.emailVerifiedAt) {
    return next(new ApiError({ statusCode: 403, message: 'Email not verified' }))
  }

  // Reset failed attempts on success
  user.failedLoginAttempts = 0
  user.lockedUntil = null
  await user.save()

  // Detect new device by checking existing sessions
  const existingSessions = await Session.find({ userId: user._id, revokedAt: null }).lean()
  const ua = req.headers?.['user-agent'] || ''
  const isNewDevice = existingSessions.length === 0 || !existingSessions.some((s) => s.userAgent === ua)

  const accessToken = signAccessToken({ userId: user._id, role: user.role })
  const tokenId = createTokenId()
  registerTokenId({ tokenId, userId: user._id })
  const refreshToken = signRefreshToken({ userId: user._id, tokenId })

  setAuthCookies({ res, refreshToken })

  // Persist session to DB
  await persistSession({ tokenId, userId: user._id, req })

  const eventType = isNewDevice && existingSessions.length > 0 ? 'new_device_login' : 'login_success'
  await logEvent({ event: eventType, userId: user._id, email, req, meta: { isNewDevice } })

  return res.json({ accessToken })
})

const logout = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken)
      if (payload?.tokenId) {
        revokeTokenId(payload.tokenId)
        await logEvent({ event: 'logout', userId: req.auth?.userId, req })
      }
    }
  } catch (_) {}

  clearAuthCookies(res)
  return res.json({ message: 'Logged out' })
})

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.json({ message: 'If account exists, reset instructions have been generated.', resetToken: null })

  const token = nanoid(32)
  const tokenHash = await bcrypt.hash(token, 10)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  user.forgotPasswordTokenHash = tokenHash
  user.forgotPasswordTokenExpiresAt = expiresAt
  await user.save()

  await logEvent({ event: 'password_reset_requested', userId: user._id, email, req })

  return res.json({ message: 'Reset token generated (mock).', resetToken: token, expiresAt })
})

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body

  const users = await User.find({ forgotPasswordTokenExpiresAt: { $gt: new Date() } })
  const match = await Promise.all(
    users.map(async (u) => {
      if (!u.forgotPasswordTokenHash) return null
      const ok = await bcrypt.compare(token, u.forgotPasswordTokenHash)
      return ok ? u : null
    })
  )

  const user = match.find(Boolean)
  if (!user) return next(new ApiError({ statusCode: 400, message: 'Invalid or expired reset token' }))

  // Check password history (last 5)
  const historyCheck = await Promise.all(
    (user.passwordHistory || []).map((h) => bcrypt.compare(newPassword, h))
  )
  if (historyCheck.some(Boolean)) {
    return next(new ApiError({ statusCode: 400, message: 'Password was used recently. Choose a different password.' }))
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  user.passwordHash = newHash
  user.passwordHistory = [newHash, ...(user.passwordHistory || [])].slice(0, 5)
  user.passwordChangedAt = new Date()
  user.forgotPasswordTokenHash = null
  user.forgotPasswordTokenExpiresAt = null
  await user.save()

  await logEvent({ event: 'password_reset_completed', userId: user._id, email: user.email, req })

  return res.json({ message: 'Password has been reset' })
})

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.body

  const userId = await verifyEmailToken(token)
  if (!userId) return next(new ApiError({ statusCode: 400, message: 'Invalid verification token' }))

  const user = await User.findById(userId)
  if (!user) return next(new ApiError({ statusCode: 404, message: 'User not found' }))

  user.emailVerifiedAt = new Date()
  await user.save()

  await logEvent({ event: 'email_verified', userId: user._id, email: user.email, req })

  return res.json({ message: 'Email verified successfully' })
})

const refresh = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) return next(new ApiError({ statusCode: 401, message: 'Missing refresh token' }))

  let payload
  try {
    payload = verifyRefreshToken(refreshToken)
  } catch (_) {
    return next(new ApiError({ statusCode: 401, message: 'Invalid refresh token' }))
  }

  const userId = payload.sub
  const tokenId = payload.tokenId

  if (!tokenId || !isTokenIdValid(tokenId)) {
    clearAuthCookies(res)
    return next(new ApiError({ statusCode: 401, message: 'Refresh token revoked' }))
  }

  const user = await User.findById(userId)
  if (!user) return next(new ApiError({ statusCode: 404, message: 'User not found' }))

  const newTokenId = createTokenId()
  markReplaced({ oldTokenId: tokenId, newTokenId })
  revokeTokenId(tokenId)
  registerTokenId({ tokenId: newTokenId, userId })

  const accessToken = signAccessToken({ userId, role: user.role })
  const newRefreshToken = signRefreshToken({ userId, tokenId: newTokenId })

  setAuthCookies({ res, refreshToken: newRefreshToken })

  // Rotate session in DB
  await Session.findOneAndUpdate({ tokenId: String(tokenId) }, { revokedAt: new Date() }).catch(() => {})
  await persistSession({ tokenId: newTokenId, userId, req })

  return res.json({ accessToken })
})

const me = asyncHandler(async (req, res) => {
  const { userId } = req.auth
  const user = await User.findById(userId).select('email role emailVerifiedAt passwordChangedAt createdAt')

  return res.json({
    id: user._id,
    email: user.email,
    role: user.role,
    emailVerified: !!user.emailVerifiedAt,
    passwordChangedAt: user.passwordChangedAt,
    createdAt: user.createdAt
  })
})

const profile = asyncHandler(async (req, res) => {
  return res.json({ message: 'Profile updated (mock).', displayName: req.body.displayName })
})

const changePassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.auth
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(userId)
  if (!user) return next(new ApiError({ statusCode: 404, message: 'User not found' }))

  const ok = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!ok) return next(new ApiError({ statusCode: 400, message: 'Current password incorrect' }))

  // Check password history
  const historyCheck = await Promise.all(
    (user.passwordHistory || []).map((h) => bcrypt.compare(newPassword, h))
  )
  if (historyCheck.some(Boolean)) {
    return next(new ApiError({ statusCode: 400, message: 'Password was used recently. Choose a different password.' }))
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  user.passwordHash = newHash
  user.passwordHistory = [newHash, ...(user.passwordHistory || [])].slice(0, 5)
  user.passwordChangedAt = new Date()
  await user.save()

  await logEvent({ event: 'password_changed', userId: user._id, email: user.email, req })

  return res.json({ message: 'Password changed' })
})

// ── Sessions ──────────────────────────────────────────────────────────────────

const getSessions = asyncHandler(async (req, res) => {
  const { userId } = req.auth
  const currentTokenId = req.currentTokenId || null

  const sessions = await Session.find({ userId, revokedAt: null })
    .sort({ lastActivityAt: -1 })
    .lean()

  return res.json({
    sessions: sessions.map((s) => ({
      id: s._id,
      tokenId: s.tokenId,
      browser: s.browser,
      os: s.os,
      device: s.device,
      ip: s.ip,
      lastActivityAt: s.lastActivityAt,
      createdAt: s.createdAt,
      isCurrent: s.tokenId === currentTokenId
    }))
  })
})

const revokeSession = asyncHandler(async (req, res, next) => {
  const { userId } = req.auth
  const { sessionId } = req.params

  const session = await Session.findOne({ _id: sessionId, userId })
  if (!session) return next(new ApiError({ statusCode: 404, message: 'Session not found' }))

  session.revokedAt = new Date()
  await session.save()

  revokeTokenId(session.tokenId)

  await logEvent({ event: 'session_revoked', userId, req, meta: { sessionId } })

  return res.json({ message: 'Session revoked' })
})

const revokeAllSessions = asyncHandler(async (req, res) => {
  const { userId } = req.auth

  const sessions = await Session.find({ userId, revokedAt: null })
  for (const s of sessions) {
    s.revokedAt = new Date()
    await s.save()
    revokeTokenId(s.tokenId)
  }

  clearAuthCookies(res)
  await logEvent({ event: 'session_revoked', userId, req, meta: { all: true } })

  return res.json({ message: 'All sessions revoked' })
})

// ── Security Insights ─────────────────────────────────────────────────────────

const getSecurityInsights = asyncHandler(async (req, res) => {
  const { userId } = req.auth
  const user = await User.findById(userId).select('email passwordChangedAt createdAt emailVerifiedAt')

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [recentLogs, failedAttempts, activeSessions] = await Promise.all([
    AuditLog.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
    AuditLog.countDocuments({ userId, event: 'login_failed', createdAt: { $gte: thirtyDaysAgo } }),
    Session.countDocuments({ userId, revokedAt: null })
  ])

  const newDeviceEvents = recentLogs.filter((l) => l.event === 'new_device_login')
  const passwordAgeDays = user.passwordChangedAt
    ? Math.floor((Date.now() - user.passwordChangedAt) / (1000 * 60 * 60 * 24))
    : null

  // Security score: 100 base, deductions for issues
  let score = 100
  if (!user.emailVerifiedAt) score -= 20
  if (failedAttempts > 3) score -= 15
  if (newDeviceEvents.length > 0) score -= 10
  if (passwordAgeDays !== null && passwordAgeDays > 90) score -= 15
  if (passwordAgeDays === null) score -= 10
  score = Math.max(0, score)

  return res.json({
    score,
    failedLoginAttempts: failedAttempts,
    activeSessions,
    newDeviceLogins: newDeviceEvents.length,
    passwordAgeDays,
    emailVerified: !!user.emailVerifiedAt,
    recentActivity: recentLogs.slice(0, 10).map((l) => ({
      event: l.event,
      browser: l.browser,
      os: l.os,
      ip: l.ip,
      createdAt: l.createdAt
    }))
  })
})

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refresh,
  me,
  profile,
  changePassword,
  getSessions,
  revokeSession,
  revokeAllSessions,
  getSecurityInsights
}
