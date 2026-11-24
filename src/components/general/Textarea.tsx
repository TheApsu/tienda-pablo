import { useId, type ComponentProps } from 'react'
import { fieldStyles } from '@/lib/fieldStyles'
import { FormField } from './FormField'

type TextareaProps = ComponentProps<'textarea'> & {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ label, error, hint, id, className, required, rows = 4, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <FormField id={textareaId} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        className={fieldStyles(Boolean(error), `py-2 ${className ?? ''}`)}
        {...props}
      />
    </FormField>
  )
}
