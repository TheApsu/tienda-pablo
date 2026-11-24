import { useId, type ComponentProps, type ReactNode } from 'react'
import { fieldStyles } from '@/lib/fieldStyles'
import { cn } from '@/lib/utils'
import { FormField } from './FormField'

type InputProps = ComponentProps<'input'> & {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
}

export function Input({ label, error, hint, leftIcon, id, className, required, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <FormField id={inputId} label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={fieldStyles(Boolean(error), cn('h-10', leftIcon ? 'pl-10' : undefined, className))}
          {...props}
        />
      </div>
    </FormField>
  )
}
