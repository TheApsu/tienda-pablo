import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SaleInfoCard } from '@/components/admin/sales/SaleInfoCard'
import { SaleItemsTable } from '@/components/admin/sales/SaleItemsTable'
import { SaleProofCard } from '@/components/admin/sales/SaleProofCard'
import { SaleReviewForm } from '@/components/admin/sales/SaleReviewForm'
import { Button } from '@/components/general/Button'
import { ButtonLink } from '@/components/general/ButtonLink'
import { ConfirmDialog } from '@/components/general/ConfirmDialog'
import { ErrorState } from '@/components/general/ErrorState'
import { FullPageLoader } from '@/components/general/FullPageLoader'
import { ArrowLeftIcon, TrashIcon } from '@/components/general/Icons'
import { PageHeader } from '@/components/general/PageHeader'
import { useDeleteSale, useReviewSale, useSale } from '@/hooks/useSales'
import { paths } from '@/router/paths'
import type { SaleReviewFormValues } from '@/schemas/sale.schema'
import type { SaleStatus } from '@/types'

export function SaleDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const sale = useSale(id)
  const reviewSale = useReviewSale()
  const deleteSale = useDeleteSale()

  if (sale.isLoading) return <FullPageLoader />
  if (sale.error || !sale.data) {
    return <ErrorState error={sale.error ?? 'Venta no encontrada'} onRetry={() => void sale.refetch()} />
  }

  const current = sale.data

  const handleReview = (status: SaleStatus, values: SaleReviewFormValues) =>
    reviewSale.mutate({ id: current.id, status, adminNotes: values.adminNotes })

  const handleDelete = () =>
    deleteSale.mutate(current, { onSuccess: () => navigate(paths.admin.sales, { replace: true }) })

  return (
    <>
      <PageHeader
        title={`Venta ${current.reference}`}
        description={`Reportada por ${current.customer_name}`}
        backLink={
          <ButtonLink to={paths.admin.sales} variant="ghost" size="sm" icon={<ArrowLeftIcon className="size-4" />}>
            Volver a ventas
          </ButtonLink>
        }
        actions={
          <Button variant="secondary" icon={<TrashIcon className="size-4" />} onClick={() => setConfirmingDelete(true)}>
            Eliminar
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-6">
          <SaleProofCard proofPath={current.proof_path} reference={current.reference} />
          <SaleItemsTable items={current.items} />
        </div>
        <div className="flex flex-col gap-6">
          <SaleInfoCard sale={current} />
          <SaleReviewForm
            key={current.updated_at}
            sale={current}
            isSubmitting={reviewSale.isPending}
            onReview={handleReview}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmingDelete}
        title="Eliminar venta"
        message="Se eliminará la venta y la foto del comprobante. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        isLoading={deleteSale.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  )
}
