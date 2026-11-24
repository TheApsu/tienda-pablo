import type { ReactNode } from 'react'

type DescriptionItemProps = {
  label: string
  value: ReactNode
}

/** Fila etiqueta/valor para usar dentro de un <dl>. */
export function DescriptionItem({ label, value }: DescriptionItemProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900 sm:text-right">{value}</dd>
    </div>
  )
}
