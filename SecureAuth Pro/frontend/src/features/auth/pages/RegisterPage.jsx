import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { FormField } from '../../../ui/forms/FormField'
import { PasswordStrengthMeter } from '../../../ui/forms/PasswordStrengthMeter'
import { Spinner } from '../../../ui/feedback/Spinner'
import { ErrorState } from '../../../ui/feedback/ErrorState'
import { apiRegister } from '../../../services/authApi'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [verificationToken, setVerificationToken] = React.useState(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  })

  const password = useWatch({ control, name: 'password' })

  async function onSubmit(values) {
    setServerError(null)
    setVerificationToken(null)
    setLoading(true)
    try {
      const data = await apiRegister(values)
      toast.success('Registered successfully')
      setVerificationToken(data.verificationToken)
    } catch (e) {
      const msg = e?.response?.data?.message || 'Registration failed'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-slate-600">Join the platform.</p>
      </div>

      {serverError && <ErrorState message={serverError} />}

      <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" type="email" {...register('email')} />
        </FormField>

        <FormField label="Password" error={errors.password?.message}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          <PasswordStrengthMeter password={password} />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2"><Spinner size={18} /> Creating...</span>
          ) : 'Create account'}
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link className="text-slate-700 hover:underline" to="/login">I already have an account</Link>
        </div>
      </form>

      {verificationToken && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="font-semibold text-emerald-900">Email verification token (mock)</div>
          <div className="mt-2 font-mono text-xs break-all text-emerald-900">{verificationToken}</div>
          <button
            className="mt-3 w-full rounded-md bg-emerald-900 px-4 py-2 text-white hover:bg-emerald-800"
            onClick={() => navigate(`/verify-email?token=${encodeURIComponent(verificationToken)}`)}
          >
            Verify email
          </button>
        </div>
      )}
    </div>
  )
}
