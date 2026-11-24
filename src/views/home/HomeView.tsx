import { useSearchParams } from 'react-router-dom'
import { ErrorState } from '@/components/general/ErrorState'
import { CategoryFilter } from '@/components/home/CategoryFilter'
import { Hero } from '@/components/home/Hero'
import { ProductGrid } from '@/components/home/ProductGrid'
import { useCategories } from '@/hooks/useCategories'
import { useProducts } from '@/hooks/useProducts'

export function HomeView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('categoria')

  const categories = useCategories()
  const products = useProducts({ onlyActive: true, categoryId: categoryId ?? undefined })

  const selectCategory = (id: string | null) =>
    setSearchParams(id ? { categoria: id } : {}, { replace: true })

  return (
    <>
      <Hero />
      <CategoryFilter categories={categories.data ?? []} selectedId={categoryId} onSelect={selectCategory} />
      {products.error ? (
        <ErrorState error={products.error} onRetry={() => void products.refetch()} />
      ) : (
        <ProductGrid products={products.data ?? []} isLoading={products.isLoading} />
      )}
    </>
  )
}
