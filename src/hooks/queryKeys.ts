import type { ProductFilters, SaleFilters } from '@/types'

export const queryKeys = {
  categories: {
    all: ['categories'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (filters: ProductFilters) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  sales: {
    all: ['sales'] as const,
    list: (filters: SaleFilters) => ['sales', 'list', filters] as const,
    detail: (id: string) => ['sales', 'detail', id] as const,
    proof: (path: string) => ['sales', 'proof', path] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
}
