const { AuditLog } = require('../models/AuditLog')
const { parseUserAgent } = require('../utils/uaParser')

/**
 * Record a security event. Fire-and-forget — never throws.
 */
async function logEvent({ event, userId = null, email = '', req = null, meta = {} }) {
  try {
    const ua = req?.headers?.['user-agent'] || ''
    const ip =
      req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req?.socket?.remoteAddress ||
      ''
    const { browser, os } = parseUserAgent(ua)

    await AuditLog.create({ event, userId, email, ip, userAgent: ua, browser, os, meta })
  } catch (_) {
    // Never let audit logging break the request
  }
}

module.exports = { logEvent }
