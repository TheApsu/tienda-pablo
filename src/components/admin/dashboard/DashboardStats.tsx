import { BoxIcon, ChartIcon, ReceiptIcon, TagIcon } from '@/components/general/Icons'
import { StatCard } from '@/components/general/StatCard'
import { formatCurrency } from '@/lib/utils'
import type { DashboardStats as Stats } from '@/types'

type DashboardStatsProps = {
  stats: Stats | undefined
  isLoading?: boolean
}

export function DashboardStats({ stats, isLoading = false }: DashboardStatsProps) {
  const value = (n: number | undefined, format?: (n: number) => string) =>
    isLoading || n === undefined ? '—' : format ? format(n) : n

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Ventas pendientes" value={value(stats?.pendingSales)} icon={<ReceiptIcon />} hint="Por revisar" />
      <StatCard
        label="Total aprobado"
        value={value(stats?.approvedTotal, formatCurrency)}
        icon={<ChartIcon />}
        hint="Suma de ventas aprobadas"
      />
      <StatCard label="Productos" value={value(stats?.products)} icon={<BoxIcon />} />
      <StatCard label="Categorías" value={value(stats?.categories)} icon={<TagIcon />} />
    </div>
  )
}
