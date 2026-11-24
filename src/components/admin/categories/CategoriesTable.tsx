import { Badge } from '@/components/general/Badge'
import { DataTable, type DataTableColumn } from '@/components/general/DataTable'
import { IconButton } from '@/components/general/IconButton'
import { PencilIcon, TrashIcon } from '@/components/general/Icons'
import { formatDate } from '@/lib/utils'
import type { CategoryWithCount } from '@/types'

type CategoriesTableProps = {
  categories: CategoryWithCount[]
  isLoading?: boolean
  onEdit: (category: CategoryWithCount) => void
  onDelete: (category: CategoryWithCount) => void
}

export function CategoriesTable({ categories, isLoading, onEdit, onDelete }: CategoriesTableProps) {
  const columns: DataTableColumn<CategoryWithCount>[] = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (category) => <span className="font-medium text-slate-900">{category.name}</span>,
    },
    {
      key: 'description',
      header: 'Descripción',
      className: 'max-w-sm',
      cell: (category) => (
        <span className="line-clamp-2 text-slate-500">{category.description || '—'}</span>
      ),
    },
    {
      key: 'products',
      header: 'Productos',
      align: 'center',
      cell: (category) => <Badge tone="info">{category.products[0]?.count ?? 0}</Badge>,
    },
    { key: 'created', header: 'Creada', cell: (category) => formatDate(category.created_at) },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      cell: (category) => (
        <div className="flex justify-end gap-1">
          <IconButton label="Editar" icon={<PencilIcon className="size-4" />} onClick={() => onEdit(category)} />
          <IconButton
            label="Eliminar"
            tone="danger"
            icon={<TrashIcon className="size-4" />}
            onClick={() => onDelete(category)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={categories}
      getRowKey={(category) => category.id}
      isLoading={isLoading}
      emptyMessage="Aún no hay categorías. Crea la primera."
    />
  )
}
