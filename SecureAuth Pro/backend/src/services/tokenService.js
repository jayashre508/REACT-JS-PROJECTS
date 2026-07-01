const jwt = require('jsonwebtoken')

function signAccessToken({ userId, role }) {
  const accessSecret = process.env.JWT_ACCESS_SECRET
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m'

  if (!accessSecret) throw new Error('JWT_ACCESS_SECRET missing')

  return jwt.sign({ sub: String(userId), role }, accessSecret, { expiresIn })
}

function signRefreshToken({ userId, tokenId }) {
  const refreshSecret = process.env.JWT_REFRESH_SECRET
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d'

  if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET missing')

  return jwt.sign({ sub: String(userId), tokenId }, refreshSecret, { expiresIn })
}

function verifyAccessToken(token) {
  const accessSecret = process.env.JWT_ACCESS_SECRET
  if (!accessSecret) throw new Error('JWT_ACCESS_SECRET missing')

  return jwt.verify(token, accessSecret)
}

function verifyRefreshToken(token) {
  const refreshSecret = process.env.JWT_REFRESH_SECRET
  if (!refreshSecret) throw new Error('JWT_REFRESH_SECRET missing')

  return jwt.verify(token, refreshSecret)
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
}

