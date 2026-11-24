import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CategoryFormValues } from '@/schemas/category.schema'
import { categoriesService } from '@/services/categories.service'
import { toast } from '@/store/toast.store'
import { queryKeys } from './queryKeys'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: categoriesService.getAll,
  })
}

function useInvalidateCategories() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats }),
    ])
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: (values: CategoryFormValues) => categoriesService.create(values),
    onSuccess: async () => {
      await invalidate()
      toast.success('Categoría creada')
    },
  })
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CategoryFormValues }) =>
      categoriesService.update(id, values),
    onSuccess: async () => {
      await invalidate()
      toast.success('Categoría actualizada')
    },
  })
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: async () => {
      await invalidate()
      toast.success('Categoría eliminada')
    },
  })
}
