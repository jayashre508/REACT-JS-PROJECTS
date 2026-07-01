const { ApiError } = require('../utils/ApiError')

// Double-submit cookie pattern.
// - CSRF token is stored in non-HttpOnly cookie: XSRF-TOKEN
// - Client sends it in header: x-csrf-token
function csrfProtection(req, res, next) {
  const safeMethod = ['GET', 'HEAD', 'OPTIONS']
  if (safeMethod.includes(req.method)) return next()

  const cookieToken = req.cookies?.['XSRF-TOKEN']
  const headerToken = req.headers['x-csrf-token']

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new ApiError({ statusCode: 403, message: 'CSRF validation failed' }))
  }

  return next()
}

module.exports = { csrfProtection }

