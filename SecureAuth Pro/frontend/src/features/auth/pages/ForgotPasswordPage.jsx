import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { FormField } from '../../../ui/forms/FormField'
import { Spinner } from '../../../ui/feedback/Spinner'
import { ErrorState } from '../../../ui/feedback/ErrorState'
import { apiForgotPassword } from '../../../services/authApi'

const schema = z.object({
  email: z.string().email()
})

export function ForgotPasswordPage() {
  const [serverError, setServerError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [resetToken, setResetToken] = React.useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  async function onSubmit(values) {
    setServerError(null)
    setResetToken(null)
    setLoading(true)
    try {
      const data = await apiForgotPassword(values)
      toast.success('If the account exists, a reset token was generated')
      setResetToken(data.resetToken)
    } catch (e) {
      const msg = e?.response?.data?.message || 'Request failed'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="text-sm text-slate-600">Request a password reset.</p>
      </div>

      {serverError && <ErrorState message={serverError} />}

      <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" type="email" {...register('email')} />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Spinner size={18} /> Generating...
            </span>
          ) : (
            'Generate reset token'
          )}
        </button>

        <Link className="text-slate-700 hover:underline text-sm" to="/login">
          Back to login
        </Link>
      </form>

      {resetToken && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="font-semibold text-amber-900">Reset token (mock)</div>
          <div className="mt-2 font-mono text-xs break-all text-amber-900">{resetToken}</div>
          <Link className="mt-3 inline-flex w-full justify-center rounded-md bg-amber-900 px-4 py-2 text-white hover:bg-amber-800" to={`/reset-password?token=${encodeURIComponent(resetToken)}`}>
            Reset password
          </Link>
        </div>
      )}
    </div>
  )
}

