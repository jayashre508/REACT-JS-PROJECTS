import React from 'react'

export function StatCard({ label, value, sub, accent = 'slate' }) {
  const colors = {
    slate: 'bg-slate-50 border-slate-200',
    green: 'bg-emerald-50 border-emerald-200',
    red: 'bg-red-50 border-red-200',
    amber: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200'
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[accent] || colors.slate}`}>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  )
}
