import { Card } from '@/components/general/Card'
import type { CartItem } from '@/types'
import { CartItemRow } from './CartItemRow'

export function CartItemsList({ items }: { items: CartItem[] }) {
  return (
    <Card title="Tu carrito" description={`${items.length} producto(s)`}>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </ul>
    </Card>
  )
}
