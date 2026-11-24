import { IconButton } from '@/components/general/IconButton'
import { TrashIcon } from '@/components/general/Icons'
import { ProductThumbnail } from '@/components/general/ProductThumbnail'
import { QuantityInput } from '@/components/general/QuantityInput'
import { formatCurrency } from '@/lib/utils'
import { useCartStore } from '@/store/cart.store'
import type { CartItem } from '@/types'

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <li className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <ProductThumbnail src={item.imageUrl} alt={item.name} className="size-16 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{item.name}</p>
          <p className="text-sm text-slate-500">{formatCurrency(item.price)} c/u</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <QuantityInput
          value={item.quantity}
          max={item.stock}
          onChange={(quantity) => updateQuantity(item.productId, quantity)}
        />
        <span className="w-24 text-right font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
        <IconButton
          label="Quitar del carrito"
          tone="danger"
          icon={<TrashIcon className="size-4" />}
          onClick={() => removeItem(item.productId)}
        />
      </div>
    </li>
  )
}
