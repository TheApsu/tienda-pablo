import { EmptyState } from '@/components/general/EmptyState'
import type { ProductWithCategory } from '@/types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'

type ProductGridProps = {
  products: ProductWithCategory[]
  isLoading?: boolean
}

const gridClass = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return <EmptyState title="No hay productos disponibles" description="Vuelve pronto o prueba con otra categoría." />
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
