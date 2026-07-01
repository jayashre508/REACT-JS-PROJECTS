import React from 'react'

const BREACHED = ['password', '123456', 'password1', 'qwerty', 'abc123', 'letmein', 'welcome', 'monkey', 'dragon']

function calcStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  const levels = [
    { label: 'Very weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-400' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Good', color: 'bg-blue-400' },
    { label: 'Strong', color: 'bg-emerald-500' }
  ]
  const idx = Math.min(score, 4)
  return { score, ...levels[idx] }
}

export function PasswordStrengthMeter({ password = '' }) {
  const { score, label, color } = calcStrength(password)
  const isBreached = BREACHED.includes(password.toLowerCase())

  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? color : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        {isBreached && (
          <span className="text-red-600 font-medium flex items-center gap-1">
            ⚠ Common password — avoid using this
          </span>
        )}
      </div>
    </div>
  )
}
