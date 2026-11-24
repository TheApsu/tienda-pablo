import { Input } from '@/components/general/Input'
import { SearchIcon } from '@/components/general/Icons'
import { Select } from '@/components/general/Select'
import type { Category } from '@/types'

type ProductsFiltersProps = {
  search: string
  categoryId: string
  categories: Category[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

export function ProductsFilters({ search, categoryId, categories, onSearchChange, onCategoryChange }: ProductsFiltersProps) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_16rem]">
      <Input
        type="search"
        placeholder="Buscar por nombre..."
        aria-label="Buscar productos"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        leftIcon={<SearchIcon className="size-4" />}
      />
      <Select
        aria-label="Filtrar por categoría"
        value={categoryId}
        onChange={(event) => onCategoryChange(event.target.value)}
        placeholder="Todas las categorías"
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
      />
    </div>
  )
}
