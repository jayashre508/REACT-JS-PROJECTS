import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { apiLogout } from '../../../services/authApi'
import { clearAccessTokenStorage } from '../../../utils/tokenStorage'

export function LogoutPage() {
  const navigate = useNavigate()

  React.useEffect(() => {
    let mounted = true
    async function run() {
      try {
        await apiLogout()
      } catch (e) {
        // Logout should be resilient
        toast.error(e?.response?.data?.message || 'Logout error')
      } finally {
        clearAccessTokenStorage()
        if (mounted) navigate('/login')
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [navigate])

  return <div className="min-h-[60vh] flex items-center justify-center">Logging out...</div>
}

