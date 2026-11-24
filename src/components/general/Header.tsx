import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type HeaderLink = {
  to: string
  label: string
  end?: boolean
}

type HeaderProps = {
  brand: string
  brandTo?: string
  links?: HeaderLink[]
  actions?: ReactNode
}

export function Header({ brand, brandTo = '/', links = [], actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to={brandTo} className="text-lg font-bold tracking-tight text-slate-900">
          {brand}
        </Link>

        {links.length > 0 && (
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-slate-900',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </header>
  )
}
