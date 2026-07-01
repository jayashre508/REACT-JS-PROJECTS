const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenId: { type: String, required: true, unique: true },
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    // Parsed from userAgent for display
    browser: { type: String, default: 'Unknown' },
    os: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' },
    lastActivityAt: { type: Date, default: Date.now },
    revokedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: false }
)

module.exports = { Session: mongoose.model('Session', sessionSchema) }
