const { nanoid } = require('nanoid')
const { Session } = require('../models/Session')
const { parseUserAgent } = require('../utils/uaParser')

// In-memory map for fast token validation (still used for auth hot-path)
const tokens = new Map() // tokenId -> { userId, revokedAt, replacedBy }

function createTokenId() {
  return nanoid(24)
}

function isTokenIdValid(tokenId) {
  const record = tokens.get(String(tokenId))
  if (!record) return false
  if (record.revokedAt) return false
  return true
}

function revokeTokenId(tokenId) {
  const record = tokens.get(String(tokenId))
  if (record) {
    record.revokedAt = new Date()
    tokens.set(String(tokenId), record)
  }
  // Persist revocation to DB (fire-and-forget)
  Session.findOneAndUpdate({ tokenId: String(tokenId) }, { revokedAt: new Date() }).catch(() => {})
}

function registerTokenId({ tokenId, userId }) {
  tokens.set(String(tokenId), { userId: String(userId), revokedAt: null, replacedBy: null })
}

function markReplaced({ oldTokenId, newTokenId }) {
  const oldRecord = tokens.get(String(oldTokenId))
  if (oldRecord) {
    oldRecord.replacedBy = String(newTokenId)
    tokens.set(String(oldTokenId), oldRecord)
  }
}

/**
 * Persist a new session to MongoDB with device metadata.
 * Called after successful login or token rotation.
 */
async function persistSession({ tokenId, userId, req }) {
  const ua = req?.headers?.['user-agent'] || ''
  const ip =
    req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    req?.socket?.remoteAddress ||
    ''
  const { browser, os, device } = parseUserAgent(ua)

  await Session.create({
    tokenId: String(tokenId),
    userId,
    userAgent: ua,
    ip,
    browser,
    os,
    device,
    lastActivityAt: new Date(),
    revokedAt: null
  })
}

/**
 * Update lastActivityAt for an existing session (called on token rotation).
 */
async function touchSession(tokenId) {
  await Session.findOneAndUpdate({ tokenId: String(tokenId) }, { lastActivityAt: new Date() }).catch(() => {})
}

module.exports = {
  createTokenId,
  registerTokenId,
  isTokenIdValid,
  revokeTokenId,
  markReplaced,
  persistSession,
  touchSession
}
