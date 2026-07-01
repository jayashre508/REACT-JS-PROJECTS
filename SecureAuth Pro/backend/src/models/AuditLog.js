const mongoose = require('mongoose')

// Event types used across the system
const EVENT_TYPES = [
  'login_success',
  'login_failed',
  'logout',
  'register',
  'password_changed',
  'password_reset_requested',
  'password_reset_completed',
  'email_verified',
  'session_revoked',
  'role_changed',
  'new_device_login'
]

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    email: { type: String, default: '' },
    event: { type: String, required: true, enum: EVENT_TYPES, index: true },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    browser: { type: String, default: 'Unknown' },
    os: { type: String, default: 'Unknown' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
)

module.exports = { AuditLog: mongoose.model('AuditLog', auditLogSchema), EVENT_TYPES }
