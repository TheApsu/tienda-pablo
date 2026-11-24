import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm } from '@/components/admin/products/ProductForm'
import { ErrorState } from '@/components/general/ErrorState'
import { FullPageLoader } from '@/components/general/FullPageLoader'
import { PageHeader } from '@/components/general/PageHeader'
import { useCategories } from '@/hooks/useCategories'
import { useProduct, useUpdateProduct } from '@/hooks/useProducts'
import { paths } from '@/router/paths'
import type { ProductFormValues } from '@/schemas/product.schema'
import { storageService } from '@/services/storage.service'

export function ProductEditView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = useProduct(id)
  const categories = useCategories()
  const updateProduct = useUpdateProduct()

  if (product.isLoading) return <FullPageLoader />
  if (product.error || !product.data) {
    return <ErrorState error={product.error ?? 'Producto no encontrado'} onRetry={() => void product.refetch()} />
  }

  const current = product.data

  const handleSubmit = (values: ProductFormValues) => {
    updateProduct.mutate({ product: current, values }, { onSuccess: () => navigate(paths.admin.products) })
  }

  return (
    <>
      <PageHeader title="Editar producto" description={current.name} />
      <ProductForm
        key={current.updated_at}
        categories={categories.data ?? []}
        defaultValues={{
          name: current.name,
          description: current.description ?? '',
          categoryId: current.category_id ?? '',
          price: String(current.price),
          stock: String(current.stock),
          isActive: current.is_active,
          image: null,
        }}
        currentImageUrl={storageService.getProductImageUrl(current.image_path)}
        submitLabel="Guardar cambios"
        isSubmitting={updateProduct.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(paths.admin.products)}
      />
    </>
  )
}
