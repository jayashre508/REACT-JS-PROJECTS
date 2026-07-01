import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { FormField } from '../../../ui/forms/FormField'
import { Spinner } from '../../../ui/feedback/Spinner'
import { ErrorState } from '../../../ui/feedback/ErrorState'
import { getAccessTokenFromStorage } from '../../../utils/tokenStorage'
import { apiUpdateProfile } from '../../../services/authApi'

const schema = z.object({
  displayName: z.string().min(2).max(60).optional().default('User')
})

export function ProfilePage() {
  const [serverError, setServerError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { displayName: 'User' }
  })

  async function onSubmit(values) {
    setServerError(null)
    setLoading(true)
    try {
      const accessToken = getAccessTokenFromStorage()
      const res = await apiUpdateProfile({ accessToken, displayName: values.displayName })
      toast.success(res?.message || 'Profile updated')
    } catch (e) {
      const msg = e?.response?.data?.message || 'Update failed'
      setServerError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="text-sm text-slate-600 mt-1">Update your profile settings.</p>

      {serverError && <div className="mt-4"><ErrorState message={serverError} /></div>}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Display name" error={errors.displayName?.message}>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            {...register('displayName')}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Spinner size={18} /> Saving...
            </span>
          ) : (
            'Save changes'
          )}
        </button>
      </form>
    </div>
  )
}

