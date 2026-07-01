import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { FormField } from '../../../ui/forms/FormField'
import { PasswordStrengthMeter } from '../../../ui/forms/PasswordStrengthMeter'
import { Spinner } from '../../../ui/feedback/Spinner'
import { ErrorState } from '../../../ui/feedback/ErrorState'
import { getAccessTokenFromStorage } from '../../../utils/tokenStorage'
import { apiChangePassword } from '../../../services/authApi'

const schema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
})

export function SettingsPage() {
  const [serverError, setServerError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '' }
  })

  const newPassword = useWatch({ control, name: 'newPassword' })

  async function onSubmit(values) {
    setServerError(null)
    setLoading(true)
    try {
      const res = await apiChangePassword({
        accessToken: getAccessTokenFromStorage(),
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })
      toast.success(res?.message || 'Password updated')
      reset()
    } catch (e) {
      const msg = e?.response?.data?.message || 'Change password failed'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Change Password</h1>
        <p className="text-sm text-slate-500 mt-1">Use a strong, unique password. Last 5 passwords cannot be reused.</p>
      </div>

      {serverError && <ErrorState message={serverError} />}

      <div className="bg-white border rounded-xl p-6">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Current password" error={errors.currentPassword?.message}>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              type="password"
              autoComplete="current-password"
              {...register('currentPassword')}
            />
          </FormField>

          <FormField label="New password" error={errors.newPassword?.message}>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              type="password"
              autoComplete="new-password"
              {...register('newPassword')}
            />
            <PasswordStrengthMeter password={newPassword} />
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2"><Spinner size={18} /> Updating...</span>
            ) : 'Change password'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="font-semibold text-slate-800 mb-2">Password requirements</div>
        <ul className="space-y-1 text-xs list-disc list-inside">
          <li>At least 8 characters</li>
          <li>Mix of uppercase, numbers, and symbols for a stronger score</li>
          <li>Cannot reuse your last 5 passwords</li>
          <li>Avoid common or breached passwords</li>
        </ul>
      </div>
    </div>
  )
}
