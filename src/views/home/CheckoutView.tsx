import { Navigate, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/general/PageHeader'
import { OrderSummary } from '@/components/home/OrderSummary'
import { PaymentInstructions } from '@/components/home/PaymentInstructions'
import { SaleReportForm } from '@/components/home/SaleReportForm'
import { useCreateSaleReport } from '@/hooks/useSales'
import { paths } from '@/router/paths'
import type { SaleReportFormValues } from '@/schemas/sale.schema'
import { selectCartTotal, useCartStore } from '@/store/cart.store'

export function CheckoutView() {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const total = useCartStore(selectCartTotal)
  const clearCart = useCartStore((state) => state.clear)
  const createReport = useCreateSaleReport()

  if (items.length === 0 && !createReport.isSuccess) return <Navigate to={paths.cart} replace />

  const handleSubmit = (values: SaleReportFormValues) =>
    createReport.mutate(
      { ...values, items },
      {
        onSuccess: () => {
          navigate(paths.checkoutSuccess, { replace: true, state: { reference: values.reference } })
          clearCart()
        },
      },
    )

  return (
    <>
      <PageHeader title="Reportar pago" description="Completa tus datos y adjunta el comprobante de tu pago" />
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <SaleReportForm isSubmitting={createReport.isPending} onSubmit={handleSubmit} />
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary items={items} total={total} />
          <PaymentInstructions />
        </div>
      </div>
    </>
  )
}
