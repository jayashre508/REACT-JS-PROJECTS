import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiMe } from '../services/authApi'

const AuthContext = React.createContext(null)

export function AuthContextProvider({ children }) {
  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: apiMe,
    retry: false
  })

  const value = {
    isReady: meQuery.status !== 'pending',
    isAuthenticated: meQuery.status === 'success',
    user: meQuery.data || null,
    refetchMe: meQuery.refetch
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthContextProvider')
  return ctx
}

