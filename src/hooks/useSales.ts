import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { salesService, type CreateSaleReportInput, type ReviewSaleInput } from '@/services/sales.service'
import { toast } from '@/store/toast.store'
import type { Sale, SaleFilters } from '@/types'
import { queryKeys } from './queryKeys'

export function useSales(filters: SaleFilters = {}) {
  return useQuery({
    queryKey: queryKeys.sales.list(filters),
    queryFn: () => salesService.getAll(filters),
  })
}

export function useSale(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sales.detail(id ?? ''),
    queryFn: () => salesService.getById(id!),
    enabled: Boolean(id),
  })
}

export function useSaleProofUrl(path: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sales.proof(path ?? ''),
    queryFn: () => salesService.getProofUrl(path!),
    enabled: Boolean(path),
    staleTime: 50 * 60 * 1000, // la URL firmada dura 60 min
  })
}

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: salesService.getDashboardStats,
  })
}

/** Cliente: reporta el pago de su compra. */
export function useCreateSaleReport() {
  return useMutation({
    mutationFn: (input: CreateSaleReportInput) => salesService.createReport(input),
  })
}

function useInvalidateSales() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats }),
      // aprobar/revertir cambia el stock de los productos
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
    ])
}

export function useReviewSale() {
  const invalidate = useInvalidateSales()
  return useMutation({
    mutationFn: (input: ReviewSaleInput) => salesService.review(input),
    onSuccess: async (sale) => {
      await invalidate()
      const messages = {
        approved: 'Venta aprobada',
        rejected: 'Venta rechazada',
        pending: 'Venta marcada como pendiente',
      } as const
      toast.success(messages[sale.status])
    },
  })
}

export function useDeleteSale() {
  const invalidate = useInvalidateSales()
  return useMutation({
    mutationFn: (sale: Sale) => salesService.remove(sale),
    onSuccess: async () => {
      await invalidate()
      toast.success('Venta eliminada')
    },
  })
}
