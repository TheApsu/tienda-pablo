import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SalesStatusFilter, type SaleStatusFilterValue } from '@/components/admin/sales/SalesStatusFilter'
import { SalesTable } from '@/components/admin/sales/SalesTable'
import { ConfirmDialog } from '@/components/general/ConfirmDialog'
import { ErrorState } from '@/components/general/ErrorState'
import { PageHeader } from '@/components/general/PageHeader'
import { SALE_STATUSES } from '@/config/constants'
import { useDeleteSale, useSales } from '@/hooks/useSales'
import type { Sale, SaleStatus } from '@/types'

const isSaleStatus = (value: string | null): value is SaleStatus =>
  SALE_STATUSES.includes(value as SaleStatus)

export function SalesView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [toDelete, setToDelete] = useState<Sale | null>(null)

  const statusParam = searchParams.get('estado')
  const status = isSaleStatus(statusParam) ? statusParam : undefined

  const sales = useSales({ status })
  const deleteSale = useDeleteSale()

  const changeStatus = (value: SaleStatusFilterValue) =>
    setSearchParams(value === 'all' ? {} : { estado: value }, { replace: true })

  const confirmDelete = () => {
    if (!toDelete) return
    deleteSale.mutate(toDelete, { onSuccess: () => setToDelete(null) })
  }

  return (
    <>
      <PageHeader title="Ventas" description="Reportes de pago enviados por los clientes" />

      <SalesStatusFilter value={status ?? 'all'} onChange={changeStatus} />

      {sales.error ? (
        <ErrorState error={sales.error} onRetry={() => void sales.refetch()} />
      ) : (
        <SalesTable sales={sales.data ?? []} isLoading={sales.isLoading} onDelete={setToDelete} />
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar venta"
        message={`Se eliminará la venta con referencia "${toDelete?.reference}" y su comprobante. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isLoading={deleteSale.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
