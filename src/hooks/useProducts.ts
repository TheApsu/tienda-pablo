import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ProductFormValues } from '@/schemas/product.schema'
import { productsService } from '@/services/products.service'
import { toast } from '@/store/toast.store'
import type { Product, ProductFilters } from '@/types'
import { queryKeys } from './queryKeys'

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsService.getAll(filters),
    placeholderData: keepPreviousData,
  })
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ''),
    queryFn: () => productsService.getById(id!),
    enabled: Boolean(id),
  })
}

function useInvalidateProducts() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats }),
    ])
}

export function useCreateProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (values: ProductFormValues) => productsService.create(values),
    onSuccess: async () => {
      await invalidate()
      toast.success('Producto creado')
    },
  })
}

export function useUpdateProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: ({ product, values }: { product: Product; values: ProductFormValues }) =>
      productsService.update(product, values),
    onSuccess: async () => {
      await invalidate()
      toast.success('Producto actualizado')
    },
  })
}

export function useDeleteProduct() {
  const invalidate = useInvalidateProducts()
  return useMutation({
    mutationFn: (product: Product) => productsService.remove(product),
    onSuccess: async () => {
      await invalidate()
      toast.success('Producto eliminado')
    },
  })
}
