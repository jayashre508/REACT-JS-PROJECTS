const express = require('express')
const {
  register, login, logout, forgotPassword, resetPassword, verifyEmail,
  refresh, me, profile, changePassword,
  getSessions, revokeSession, revokeAllSessions, getSecurityInsights
} = require('../controllers/auth.controller')
const { validateBody } = require('../middlewares/validationMiddleware')
const { requireAuth } = require('../middlewares/authMiddleware')
const { csrfProtection } = require('../middlewares/csrfMiddleware')
const {
  registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema,
  verifyEmailSchema, changePasswordSchema, profileSchema
} = require('../utils/validators')

const router = express.Router()

router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)
router.post('/logout', requireAuth, logout)

router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword)
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword)
router.post('/verify-email', validateBody(verifyEmailSchema), verifyEmail)

router.post('/refresh', refresh)

router.get('/me', requireAuth, me)
router.put('/profile', requireAuth, csrfProtection, validateBody(profileSchema), profile)
router.put('/change-password', requireAuth, csrfProtection, validateBody(changePasswordSchema), changePassword)

// Sessions
router.get('/sessions', requireAuth, getSessions)
router.delete('/sessions/:sessionId', requireAuth, revokeSession)
router.delete('/sessions', requireAuth, revokeAllSessions)

// Security insights
router.get('/security-insights', requireAuth, getSecurityInsights)

module.exports = router
