import { useId, type ComponentProps } from 'react'

type SwitchProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
  description?: string
}

export function Switch({ label, description, id, className, ...props }: SwitchProps) {
  const generatedId = useId()
  const switchId = id ?? generatedId

  return (
    <label htmlFor={switchId} className={`flex cursor-pointer items-start gap-3 ${className ?? ''}`}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={switchId} type="checkbox" className="peer sr-only" {...props} />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300" />
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {description && <span className="text-xs text-slate-500">{description}</span>}
      </span>
    </label>
  )
}
