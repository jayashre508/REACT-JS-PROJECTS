/**
 * Lightweight UA parser — no external dependency.
 * Returns { browser, os, device } strings for display.
 */
function parseUserAgent(ua = '') {
  const s = ua.toLowerCase()

  let browser = 'Unknown'
  if (s.includes('edg/') || s.includes('edge/')) browser = 'Edge'
  else if (s.includes('opr/') || s.includes('opera')) browser = 'Opera'
  else if (s.includes('chrome') && !s.includes('chromium')) browser = 'Chrome'
  else if (s.includes('firefox')) browser = 'Firefox'
  else if (s.includes('safari') && !s.includes('chrome')) browser = 'Safari'
  else if (s.includes('msie') || s.includes('trident')) browser = 'IE'

  let os = 'Unknown'
  if (s.includes('windows nt')) os = 'Windows'
  else if (s.includes('mac os x') || s.includes('macos')) os = 'macOS'
  else if (s.includes('iphone') || s.includes('ipad')) os = 'iOS'
  else if (s.includes('android')) os = 'Android'
  else if (s.includes('linux')) os = 'Linux'

  let device = 'Desktop'
  if (s.includes('mobile') || s.includes('iphone') || s.includes('android')) device = 'Mobile'
  else if (s.includes('ipad') || s.includes('tablet')) device = 'Tablet'

  return { browser, os, device }
}

module.exports = { parseUserAgent }
