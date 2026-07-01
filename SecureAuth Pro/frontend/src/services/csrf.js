export function getCsrfTokenFromCookie() {
  // XSRF-TOKEN is non-HttpOnly cookie set by backend
  const name = 'XSRF-TOKEN'
  const cookies = document.cookie.split(';').map((c) => c.trim())
  for (const c of cookies) {
    if (c.startsWith(name + '=')) {
      return decodeURIComponent(c.substring(name.length + 1))
    }
  }
  return null
}

