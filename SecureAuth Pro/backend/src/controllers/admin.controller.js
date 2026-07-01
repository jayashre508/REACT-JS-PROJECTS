const { User } = require('../models/User')
const { Session } = require('../models/Session')
const { AuditLog } = require('../models/AuditLog')
const { ApiError } = require('../utils/ApiError')
const { asyncHandler } = require('../utils/asyncHandler')
const { logEvent } = require('../services/auditLogService')

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('email role emailVerifiedAt createdAt failedLoginAttempts lockedUntil passwordChangedAt')
    .sort({ createdAt: -1 })
  return res.json({ users })
})

const updateUserRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const { role } = req.body

  const user = await User.findById(id)
  if (!user) return next(new ApiError({ statusCode: 404, message: 'User not found' }))

  const oldRole = user.role
  user.role = role
  await user.save()

  await logEvent({
    event: 'role_changed',
    userId: user._id,
    email: user.email,
    req,
    meta: { from: oldRole, to: role, changedBy: req.auth?.userId }
  })

  return res.json({ message: 'Role updated', user: { id: user._id, email: user.email, role: user.role } })
})

const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    verifiedUsers,
    lockedUsers,
    recentUsers,
    activeSessions,
    failedLoginsTotal,
    failedLoginsRecent,
    recentAuditLogs
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ emailVerifiedAt: { $ne: null } }),
    User.countDocuments({ lockedUntil: { $gt: now } }),
    User.find({ createdAt: { $gte: sevenDaysAgo } })
      .select('email role createdAt emailVerifiedAt')
      .sort({ createdAt: -1 })
      .limit(10),
    Session.countDocuments({ revokedAt: null }),
    AuditLog.countDocuments({ event: 'login_failed', createdAt: { $gte: thirtyDaysAgo } }),
    AuditLog.countDocuments({ event: 'login_failed', createdAt: { $gte: sevenDaysAgo } }),
    AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
  ])

  // Failed logins per day (last 7 days) for chart
  const failedByDay = await AuditLog.aggregate([
    { $match: { event: 'login_failed', createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  return res.json({
    stats: {
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      lockedUsers,
      activeSessions,
      failedLoginsLast30Days: failedLoginsTotal,
      failedLoginsLast7Days: failedLoginsRecent
    },
    recentUsers,
    failedLoginsByDay: failedByDay,
    recentAuditLogs: recentAuditLogs.map((l) => ({
      id: l._id,
      event: l.event,
      email: l.email,
      browser: l.browser,
      os: l.os,
      ip: l.ip,
      createdAt: l.createdAt
    }))
  })
})

const getAuditLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(50, parseInt(req.query.limit) || 20)
  const event = req.query.event || null

  const filter = event ? { event } : {}
  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter)
  ])

  return res.json({
    logs: logs.map((l) => ({
      id: l._id,
      event: l.event,
      email: l.email,
      browser: l.browser,
      os: l.os,
      ip: l.ip,
      meta: l.meta,
      createdAt: l.createdAt
    })),
    total,
    page,
    pages: Math.ceil(total / limit)
  })
})

const unlockUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user) return next(new ApiError({ statusCode: 404, message: 'User not found' }))

  user.lockedUntil = null
  user.failedLoginAttempts = 0
  await user.save()

  return res.json({ message: 'User unlocked' })
})

module.exports = { listUsers, updateUserRole, getDashboardStats, getAuditLogs, unlockUser }
