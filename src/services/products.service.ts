import { supabase } from '@/lib/supabase'
import { emptyToNull } from '@/lib/utils'
import type { ProductFormValues } from '@/schemas/product.schema'
import type { Product, ProductFilters, ProductWithCategory } from '@/types'
import { storageService } from './storage.service'

const PRODUCT_SELECT = '*, category:categories(id, name)'

const toRow = (values: ProductFormValues) => ({
  name: values.name,
  description: emptyToNull(values.description),
  category_id: values.categoryId || null,
  price: values.price,
  stock: values.stock,
  is_active: values.isActive,
})

export const productsService = {
  async getAll(filters: ProductFilters = {}): Promise<ProductWithCategory[]> {
    let query = supabase.from('products').select(PRODUCT_SELECT).order('created_at', { ascending: false })

    if (filters.onlyActive) query = query.eq('is_active', true)
    if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
    if (filters.search?.trim()) query = query.ilike('name', `%${filters.search.trim()}%`)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id: string): Promise<ProductWithCategory> {
    const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', id).single()
    if (error) throw error
    return data
  },

  async create(values: ProductFormValues): Promise<Product> {
    const imagePath = values.image ? await storageService.uploadProductImage(values.image) : null

    const { data, error } = await supabase
      .from('products')
      .insert({ ...toRow(values), image_path: imagePath })
      .select()
      .single()

    if (error) {
      await storageService.removeProductImage(imagePath)
      throw error
    }
    return data
  },

  async update(product: Product, values: ProductFormValues): Promise<Product> {
    const newImagePath = values.image ? await storageService.uploadProductImage(values.image) : null

    const { data, error } = await supabase
      .from('products')
      .update({ ...toRow(values), image_path: newImagePath ?? product.image_path })
      .eq('id', product.id)
      .select()
      .single()

    if (error) {
      await storageService.removeProductImage(newImagePath)
      throw error
    }

    // Si se subió una imagen nueva, se borra la anterior.
    if (newImagePath) await storageService.removeProductImage(product.image_path)
    return data
  },

  async remove(product: Product): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) throw error
    await storageService.removeProductImage(product.image_path)
  },
}
