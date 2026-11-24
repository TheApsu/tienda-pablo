import { ButtonLink } from '@/components/general/ButtonLink'
import { Card } from '@/components/general/Card'
import { formatCurrency } from '@/lib/utils'
import { paths } from '@/router/paths'
import { selectCartTotal, useCartStore } from '@/store/cart.store'

export function CartSummary() {
  const total = useCartStore(selectCartTotal)

  return (
    <Card title="Resumen">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <span className="text-slate-500">Total</span>
        <span className="text-2xl font-bold text-slate-900">{formatCurrency(total)}</span>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <ButtonLink to={paths.checkout} size="lg">
          Reportar pago
        </ButtonLink>
        <ButtonLink to={paths.home} variant="ghost">
          Seguir comprando
        </ButtonLink>
      </div>
    </Card>
  )
}
