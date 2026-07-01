const { nanoid } = require('nanoid')

// Mock email sender.
// Stores verification links in-memory in production for demo purposes.
// For portfolio use we still keep API fully functional.
const verificationRequests = new Map()

async function sendVerificationEmail({ userId }) {
  const token = nanoid(24)
  verificationRequests.set(token, { userId: String(userId), createdAt: Date.now() })
  return { token, mockDestination: 'mock-email@local' }
}

async function verifyEmailToken(token) {
  const record = verificationRequests.get(token)
  if (!record) return null
  // token consumed
  verificationRequests.delete(token)
  return record.userId
}

module.exports = { sendVerificationEmail, verifyEmailToken }

