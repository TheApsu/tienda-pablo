import { useState } from 'react'
import { ProductsFilters } from '@/components/admin/products/ProductsFilters'
import { ProductsTable } from '@/components/admin/products/ProductsTable'
import { ButtonLink } from '@/components/general/ButtonLink'
import { ConfirmDialog } from '@/components/general/ConfirmDialog'
import { ErrorState } from '@/components/general/ErrorState'
import { PlusIcon } from '@/components/general/Icons'
import { PageHeader } from '@/components/general/PageHeader'
import { useCategories } from '@/hooks/useCategories'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useDeleteProduct, useProducts } from '@/hooks/useProducts'
import { paths } from '@/router/paths'
import type { ProductWithCategory } from '@/types'

export function ProductsView() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [toDelete, setToDelete] = useState<ProductWithCategory | null>(null)

  const debouncedSearch = useDebouncedValue(search)
  const products = useProducts({ search: debouncedSearch, categoryId })
  const categories = useCategories()
  const deleteProduct = useDeleteProduct()

  const confirmDelete = () => {
    if (!toDelete) return
    deleteProduct.mutate(toDelete, { onSuccess: () => setToDelete(null) })
  }

  return (
    <>
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo de la tienda"
        actions={
          <ButtonLink to={paths.admin.productCreate} icon={<PlusIcon className="size-4" />}>
            Nuevo producto
          </ButtonLink>
        }
      />

      <ProductsFilters
        search={search}
        categoryId={categoryId}
        categories={categories.data ?? []}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryId}
      />

      {products.error ? (
        <ErrorState error={products.error} onRetry={() => void products.refetch()} />
      ) : (
        <ProductsTable products={products.data ?? []} isLoading={products.isLoading} onDelete={setToDelete} />
      )}

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar producto"
        message={`¿Seguro que quieres eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isLoading={deleteProduct.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
