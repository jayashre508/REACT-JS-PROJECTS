import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { FormField } from '../../../ui/forms/FormField'
import { Spinner } from '../../../ui/feedback/Spinner'
import { ErrorState } from '../../../ui/feedback/ErrorState'
import { apiResetPassword } from '../../../services/authApi'

const schema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8)
})

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const query = useQuery()
  const initialToken = query.get('token') || ''

  const [serverError, setServerError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { token: initialToken, newPassword: '' }
  })

  async function onSubmit(values) {
    setServerError(null)
    setLoading(true)
    try {
      await apiResetPassword({ token: values.token, newPassword: values.newPassword })
      toast.success('Password reset. Please login.')
      navigate('/login')
    } catch (e) {
      const msg = e?.response?.data?.message || 'Reset failed'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-slate-600">Choose a new password.</p>
      </div>

      {serverError && <ErrorState message={serverError} />}

      <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register('token')} value={initialToken} />

        <FormField label="New password" error={errors.newPassword?.message}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="password"
            autoComplete="new-password"
            {...register('newPassword')}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Spinner size={18} /> Updating...
            </span>
          ) : (
            'Reset password'
          )}
        </button>

        <Link className="text-slate-700 hover:underline text-sm" to="/login">
          Back to login
        </Link>
      </form>
    </div>
  )
}

