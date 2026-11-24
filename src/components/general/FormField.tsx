import type { ReactNode } from 'react'

type FormFieldProps = {
  id: string
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

/** Envoltorio común de label + mensaje de error/ayuda para cualquier input. */
export function FormField({ id, label, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  )
}
