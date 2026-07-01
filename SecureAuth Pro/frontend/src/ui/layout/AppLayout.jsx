import React from 'react'
import { NavBar } from '../nav/NavBar'

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

