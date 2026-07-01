const express = require('express')
const { requireAuth } = require('../middlewares/authMiddleware')
const { requireRole } = require('../middlewares/roleMiddleware')
const { listUsers, updateUserRole, getDashboardStats, getAuditLogs, unlockUser } = require('../controllers/admin.controller')
const { validateBody } = require('../middlewares/validationMiddleware')
const { updateUserRoleSchema } = require('../utils/validators')

const router = express.Router()

const adminOnly = [requireAuth, requireRole(['admin'])]

router.get('/users', ...adminOnly, listUsers)
router.patch('/users/:id/role', ...adminOnly, validateBody(updateUserRoleSchema), updateUserRole)
router.patch('/users/:id/unlock', ...adminOnly, unlockUser)

router.get('/dashboard', ...adminOnly, getDashboardStats)
router.get('/audit-logs', ...adminOnly, getAuditLogs)

module.exports = router
