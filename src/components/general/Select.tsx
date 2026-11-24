import { useId, type ComponentProps } from 'react'
import { fieldStyles } from '@/lib/fieldStyles'
import { FormField } from './FormField'

export type SelectOption = {
  value: string
  label: string
}

type SelectProps = ComponentProps<'select'> & {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export function Select({ label, error, hint, options, placeholder, id, className, required, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <FormField id={selectId} label={label} error={error} hint={hint} required={required}>
      <select
        id={selectId}
        aria-invalid={Boolean(error)}
        className={fieldStyles(Boolean(error), `h-10 ${className ?? ''}`)}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}
