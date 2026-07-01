const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    emailVerifiedAt: { type: Date, default: null },
    forgotPasswordTokenHash: { type: String, default: null },
    forgotPasswordTokenExpiresAt: { type: Date, default: null },
    // Password security
    passwordChangedAt: { type: Date, default: null },
    passwordHistory: { type: [String], default: [] }, // last 5 hashes
    // Account lockout
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = { User: mongoose.model('User', userSchema) }
