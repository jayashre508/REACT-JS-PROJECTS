import React from 'react'

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
      <div className="font-semibold">{title}</div>
      {description && <div className="mt-1 text-sm text-slate-600">{description}</div>}
    </div>
  )
}

