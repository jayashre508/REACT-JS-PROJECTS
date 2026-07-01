import React from 'react'
import { useAuth } from '../state/useAuth'

export function RoleBasedRoute({ roles = [], children }) {
  const { user } = useAuth()

  if (!user) {
    return <div className="min-h-[60vh] flex items-center justify-center">Unauthorized</div>
  }

  if (!roles.includes(user.role)) {
    return <div className="min-h-[60vh] flex items-center justify-center text-red-600">Forbidden</div>
  }

  return children
}

