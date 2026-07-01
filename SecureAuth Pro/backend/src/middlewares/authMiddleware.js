const { ApiError } = require('../utils/ApiError')
const { verifyAccessToken } = require('../services/tokenService')

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      throw new ApiError({ statusCode: 401, message: 'Missing access token' })
    }

    const payload = verifyAccessToken(token)
    req.auth = { userId: payload.sub, role: payload.role }

    return next()
  } catch (err) {
    return next(new ApiError({ statusCode: 401, message: 'Unauthorized' }))
  }
}

module.exports = { requireAuth }

