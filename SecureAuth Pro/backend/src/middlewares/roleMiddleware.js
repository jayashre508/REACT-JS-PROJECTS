const { ApiError } = require('../utils/ApiError')

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.auth?.role
    if (!role || !allowedRoles.includes(role)) {
      return next(new ApiError({ statusCode: 403, message: 'Forbidden' }))
    }
    return next()
  }
}

module.exports = { requireRole }

