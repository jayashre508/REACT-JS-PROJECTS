const express = require('express')

const authRoutes = require('./auth.routes')
const adminRoutes = require('./admin.routes')

const apiRouter = express.Router()

apiRouter.use('/auth', authRoutes)
apiRouter.use('/admin', adminRoutes)

module.exports = { apiRouter }

