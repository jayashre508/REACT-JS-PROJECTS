import React from 'react'

export function Spinner({ size = 20 }) {
  return (
    <span
      aria-label="Loading"
      style={{ width: size, height: size }}
      className="inline-block animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"
    />
  )
}

