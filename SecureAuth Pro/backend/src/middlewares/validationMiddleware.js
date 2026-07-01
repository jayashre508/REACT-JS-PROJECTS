const { ApiError } = require('../utils/ApiError')

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return next(new ApiError({
        statusCode: 400,
        message: 'Validation error',
        details: result.error.flatten()
      }))
    }

    req.body = result.data
    return next()
  }
}

module.exports = { validateBody }

