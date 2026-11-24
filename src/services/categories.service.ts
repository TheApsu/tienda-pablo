import { supabase } from '@/lib/supabase'
import { emptyToNull } from '@/lib/utils'
import type { CategoryFormValues } from '@/schemas/category.schema'
import type { Category, CategoryWithCount } from '@/types'

const toRow = (values: CategoryFormValues) => ({
  name: values.name,
  description: emptyToNull(values.description),
})

export const categoriesService = {
  async getAll(): Promise<CategoryWithCount[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('name', { ascending: true })
    if (error) throw error
    return data
  },

  async create(values: CategoryFormValues): Promise<Category> {
    const { data, error } = await supabase.from('categories').insert(toRow(values)).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, values: CategoryFormValues): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(toRow(values))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },
}
