import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { FormField } from '../../../ui/forms/FormField'
import { Spinner } from '../../../ui/feedback/Spinner'
import { ErrorState } from '../../../ui/feedback/ErrorState'
import { apiLogin, apiRefresh } from '../../../services/authApi'
import { setAccessTokenToStorage } from '../../../utils/tokenStorage'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export function LoginPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  async function onSubmit(values) {
    setServerError(null)
    setLoading(true)
    try {
      const data = await apiLogin(values)
      if (data?.accessToken) {
        setAccessTokenToStorage(data.accessToken)
      }
      toast.success('Welcome back')

      // Access token is stored locally for API header attaching.
      // Refresh endpoint exists for silent refresh on protected calls.
      await apiRefresh()

      navigate('/dashboard')
    } catch (e) {
      const msg = e?.response?.data?.message || 'Login failed'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-slate-600">Use your account credentials.</p>
      </div>

      {serverError && <ErrorState message={serverError} />}

      <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="email"
            autoComplete="email"
            {...register('email')}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Spinner size={18} /> Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link className="text-slate-700 hover:underline" to="/forgot-password">
            Forgot password?
          </Link>
          <Link className="text-slate-700 hover:underline" to="/register">
            Create account
          </Link>
        </div>
      </form>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <div className="font-semibold text-slate-900">Email verification (mock)</div>
        <div className="mt-1">
          After registration, use the returned <span className="font-mono">verificationToken</span> on
          the Verify page.
        </div>
      </div>
    </div>
  )
}

