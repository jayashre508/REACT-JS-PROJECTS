const KEY = 'access_token'

export function setAccessTokenToStorage(token) {
  window.localStorage.setItem(KEY, token)
}

export function getAccessTokenFromStorage() {
  return window.localStorage.getItem(KEY)
}

export function clearAccessTokenStorage() {
  window.localStorage.removeItem(KEY)
}

