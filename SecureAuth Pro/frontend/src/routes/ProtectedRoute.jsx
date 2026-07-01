import React from 'react'
import { useAuth } from '../state/useAuth'

export function ProtectedRoute({ children }) {
  const { isReady, isAuthenticated } = useAuth()

  if (!isReady) {
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <div className="min-h-[60vh] flex items-center justify-center">Redirecting...</div>
  }

  return children
}

