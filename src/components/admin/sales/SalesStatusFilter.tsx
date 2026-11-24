import { SALE_STATUS_LABEL, SALE_STATUSES } from '@/config/constants'
import { cn } from '@/lib/utils'
import type { SaleStatus } from '@/types'

export type SaleStatusFilterValue = SaleStatus | 'all'

type SalesStatusFilterProps = {
  value: SaleStatusFilterValue
  onChange: (value: SaleStatusFilterValue) => void
}

const options: { value: SaleStatusFilterValue; label: string }[] = [
  { value: 'all', label: 'Todas' },
  ...SALE_STATUSES.map((status) => ({ value: status, label: SALE_STATUS_LABEL[status] })),
]

export function SalesStatusFilter({ value, onChange }: SalesStatusFilterProps) {
  return (
    <div role="tablist" aria-label="Filtrar por estado" className="mb-4 inline-flex rounded-xl bg-slate-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-lg px-4 py-1.5 text-sm font-medium transition',
            value === option.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
