class ApiError extends Error {
  constructor({ statusCode = 500, message = 'Error', details } = {}) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

module.exports = { ApiError }

