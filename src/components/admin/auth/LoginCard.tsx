import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { storeConfig } from '@/config/store.config'
import { paths } from '@/router/paths'

type LoginCardProps = {
  children: ReactNode
}

export function LoginCard({ children }: LoginCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Link to={paths.home} className="text-sm font-semibold text-brand-600">
            {storeConfig.name}
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Panel de administración</h1>
          <p className="mt-1 text-sm text-slate-500">Ingresa con tu cuenta de administrador</p>
        </div>
        {children}
      </div>
    </div>
  )
}
