import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Tooltip } from './Tooltip'

type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  label: string
  icon: ReactNode
  tone?: 'neutral' | 'danger'
}

/** Botón solo con ícono + tooltip (acciones de tablas). */
export function IconButton({ label, icon, tone = 'neutral', className, type = 'button', ...props }: IconButtonProps) {
  return (
    <Tooltip content={label}>
      <button
        type={type}
        aria-label={label}
        className={cn(
          'rounded-lg p-2 transition disabled:opacity-50',
          tone === 'danger'
            ? 'text-slate-500 hover:bg-red-50 hover:text-red-600'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    </Tooltip>
  )
}
