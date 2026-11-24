import type { Enums, Tables } from './database.types'

export type Category = Tables<'categories'>
export type CategoryWithCount = Category & { products: { count: number }[] }

export type Product = Tables<'products'>
export type ProductWithCategory = Product & {
  category: Pick<Category, 'id' | 'name'> | null
}

export type SaleStatus = Enums<'sale_status'>
export type Sale = Tables<'sales'>
export type SaleItem = Tables<'sale_items'>
export type SaleWithItems = Sale & { items: SaleItem[] }

export type CartItem = {
  productId: string
  name: string
  price: number
  imageUrl: string | null
  stock: number
  quantity: number
}

export type ProductFilters = {
  search?: string
  categoryId?: string
  onlyActive?: boolean
}

export type SaleFilters = {
  status?: SaleStatus
  limit?: number
}

export type DashboardStats = {
  products: number
  categories: number
  pendingSales: number
  approvedTotal: number
}
