import React from 'react'

export function FormField({ label, error, children }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      {children}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  )
}

