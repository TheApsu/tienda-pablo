import { Link } from 'react-router-dom'
import { CartIcon } from '@/components/general/Icons'
import { paths } from '@/router/paths'
import { selectCartCount, useCartStore } from '@/store/cart.store'

export function CartButton() {
  const count = useCartStore(selectCartCount)

  return (
    <Link
      to={paths.cart}
      aria-label={`Carrito (${count} productos)`}
      className="relative rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
    >
      <CartIcon className="size-6" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
