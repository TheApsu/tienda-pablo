import { cn } from '@/lib/utils'
import type { Category } from '@/types'

type CategoryFilterProps = {
  categories: Category[]
  selectedId: string | null
  onSelect: (categoryId: string | null) => void
}

export function CategoryFilter({ categories, selectedId, onSelect }: CategoryFilterProps) {
  const chip = (active: boolean) =>
    cn(
      'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition',
      active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300',
    )

  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categorías">
      <button type="button" role="tab" aria-selected={!selectedId} className={chip(!selectedId)} onClick={() => onSelect(null)}>
        Todo
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={selectedId === category.id}
          className={chip(selectedId === category.id)}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
