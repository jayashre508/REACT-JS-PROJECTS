import React from 'react'

export function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      <div className="font-semibold">Error</div>
      <div className="text-sm">{message}</div>
    </div>
  )
}

