import { Badge } from '@/components/general/Badge'
import { Button } from '@/components/general/Button'
import { CartIcon } from '@/components/general/Icons'
import { ProductThumbnail } from '@/components/general/ProductThumbnail'
import { formatCurrency } from '@/lib/utils'
import { storageService } from '@/services/storage.service'
import { useCartStore } from '@/store/cart.store'
import { toast } from '@/store/toast.store'
import type { ProductWithCategory } from '@/types'

type ProductCardProps = {
  product: ProductWithCategory
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const inCart = useCartStore((state) => state.items.find((item) => item.productId === product.id)?.quantity ?? 0)

  const imageUrl = storageService.getProductImageUrl(product.image_path)
  const isSoldOut = product.stock === 0
  const reachedLimit = inCart >= product.stock

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl,
      stock: product.stock,
    })
    toast.success(`"${product.name}" agregado al carrito`)
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md">
      <div className="relative">
        <ProductThumbnail src={imageUrl} alt={product.name} className="aspect-square w-full" />
        {product.category && (
          <Badge className="absolute left-3 top-3 bg-white/90">{product.category.name}</Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        {product.description && <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
          {isSoldOut ? (
            <Badge tone="danger">Agotado</Badge>
          ) : (
            <Button size="sm" icon={<CartIcon className="size-4" />} onClick={handleAdd} disabled={reachedLimit}>
              {inCart > 0 ? `Agregar (${inCart})` : 'Agregar'}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
