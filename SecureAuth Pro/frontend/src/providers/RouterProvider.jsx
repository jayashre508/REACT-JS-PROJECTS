import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../ui/layout/AppLayout'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage'
import { VerifyEmailPage } from '../features/auth/pages/VerifyEmailPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { ProfilePage } from '../features/dashboard/pages/ProfilePage'
import { SettingsPage } from '../features/dashboard/pages/SettingsPage'
import { AdminPage } from '../features/dashboard/pages/AdminPage'
import { SessionsPage } from '../features/dashboard/pages/SessionsPage'
import { SecurityCenterPage } from '../features/dashboard/pages/SecurityCenterPage'
import { ProtectedRoute } from '../routes/ProtectedRoute'
import { RoleBasedRoute } from '../routes/RoleBasedRoute'
import { AuthContextProvider } from '../state/AuthContext'
import { useAuth } from '../state/useAuth'

function RequireAuth({ children }) {
  const { isReady, isAuthenticated } = useAuth()
  if (!isReady) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <RequireAuth>{children}</RequireAuth>
    </ProtectedRoute>
  )
}

export function RouterProvider() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
            <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
            <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
            <Route path="/sessions" element={<Protected><SessionsPage /></Protected>} />
            <Route path="/security" element={<Protected><SecurityCenterPage /></Protected>} />

            <Route
              path="/admin"
              element={
                <Protected>
                  <RoleBasedRoute roles={['admin']}><AdminPage /></RoleBasedRoute>
                </Protected>
              }
            />
            <Route path="*" element={<div className="p-8 text-center text-slate-500">Page not found</div>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthContextProvider>
  )
}
