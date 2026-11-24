import { useNavigate } from 'react-router-dom'
import { ProductForm } from '@/components/admin/products/ProductForm'
import { PageHeader } from '@/components/general/PageHeader'
import { useCategories } from '@/hooks/useCategories'
import { useCreateProduct } from '@/hooks/useProducts'
import { paths } from '@/router/paths'
import type { ProductFormValues } from '@/schemas/product.schema'

export function ProductCreateView() {
  const navigate = useNavigate()
  const categories = useCategories()
  const createProduct = useCreateProduct()

  const handleSubmit = (values: ProductFormValues) => {
    createProduct.mutate(values, { onSuccess: () => navigate(paths.admin.products) })
  }

  return (
    <>
      <PageHeader title="Nuevo producto" description="Agrega un producto al catálogo" />
      <ProductForm
        categories={categories.data ?? []}
        submitLabel="Crear producto"
        isSubmitting={createProduct.isPending}
        onSubmit={handleSubmit}
        onCancel={() => navigate(paths.admin.products)}
      />
    </>
  )
}
