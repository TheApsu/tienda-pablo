import { ButtonLink } from '@/components/general/ButtonLink'
import { EmptyState } from '@/components/general/EmptyState'
import { CartIcon } from '@/components/general/Icons'
import { CartItemsList } from '@/components/home/CartItemsList'
import { CartSummary } from '@/components/home/CartSummary'
import { paths } from '@/router/paths'
import { useCartStore } from '@/store/cart.store'

export function CartView() {
  const items = useCartStore((state) => state.items)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<CartIcon />}
        title="Tu carrito está vacío"
        description="Agrega productos del catálogo para continuar."
        action={<ButtonLink to={paths.home}>Ver catálogo</ButtonLink>}
      />
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <CartItemsList items={items} />
      <div className="lg:sticky lg:top-24 lg:self-start">
        <CartSummary />
      </div>
    </div>
  )
}
