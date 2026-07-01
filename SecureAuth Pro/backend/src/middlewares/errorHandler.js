function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  const status = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  const details = err.details
  res.status(status).json({
    message,
    ...(details ? { details } : {})
  })
}

module.exports = { errorHandler }

