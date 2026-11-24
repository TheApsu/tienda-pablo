import { DashboardStats } from '@/components/admin/dashboard/DashboardStats'
import { SalesTable } from '@/components/admin/sales/SalesTable'
import { ButtonLink } from '@/components/general/ButtonLink'
import { Card } from '@/components/general/Card'
import { ErrorState } from '@/components/general/ErrorState'
import { PageHeader } from '@/components/general/PageHeader'
import { useDashboardStats, useSales } from '@/hooks/useSales'
import { paths } from '@/router/paths'

export function DashboardView() {
  const stats = useDashboardStats()
  const pendingSales = useSales({ status: 'pending', limit: 5 })

  return (
    <>
      <PageHeader title="Resumen" description="Estado general de la tienda" />

      {stats.error ? (
        <ErrorState error={stats.error} onRetry={() => void stats.refetch()} />
      ) : (
        <DashboardStats stats={stats.data} isLoading={stats.isLoading} />
      )}

      <Card
        title="Ventas por revisar"
        description="Últimos reportes de pago pendientes"
        className="mt-6"
        actions={
          <ButtonLink to={paths.admin.sales} variant="secondary" size="sm">
            Ver todas
          </ButtonLink>
        }
      >
        <SalesTable
          sales={pendingSales.data ?? []}
          isLoading={pendingSales.isLoading}
          emptyMessage="No hay ventas pendientes 🎉"
        />
      </Card>
    </>
  )
}
