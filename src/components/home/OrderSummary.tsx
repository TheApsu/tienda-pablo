import { Card } from '@/components/general/Card'
import { formatCurrency } from '@/lib/utils'
import type { CartItem } from '@/types'

type OrderSummaryProps = {
  items: CartItem[]
  total: number
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <Card title="Tu pedido">
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">
              {item.quantity} × {item.name}
            </span>
            <span className="font-medium text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="font-medium text-slate-700">Total a pagar</span>
        <span className="text-xl font-bold text-slate-900">{formatCurrency(total)}</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">El total final se confirma con los precios vigentes al enviar el reporte.</p>
    </Card>
  )
}
