import { Link } from 'react-router-dom'
import { Badge } from '@/components/general/Badge'
import { DataTable, type DataTableColumn } from '@/components/general/DataTable'
import { IconButton } from '@/components/general/IconButton'
import { PencilIcon, TrashIcon } from '@/components/general/Icons'
import { ProductThumbnail } from '@/components/general/ProductThumbnail'
import { Tooltip } from '@/components/general/Tooltip'
import { formatCurrency } from '@/lib/utils'
import { paths } from '@/router/paths'
import { storageService } from '@/services/storage.service'
import type { ProductWithCategory } from '@/types'

type ProductsTableProps = {
  products: ProductWithCategory[]
  isLoading?: boolean
  onDelete: (product: ProductWithCategory) => void
}

export function ProductsTable({ products, isLoading, onDelete }: ProductsTableProps) {
  const columns: DataTableColumn<ProductWithCategory>[] = [
    {
      key: 'name',
      header: 'Producto',
      cell: (product) => (
        <div className="flex items-center gap-3">
          <ProductThumbnail
            src={storageService.getProductImageUrl(product.image_path)}
            alt={product.name}
            className="size-10 shrink-0 rounded-lg"
          />
          <span className="font-medium text-slate-900">{product.name}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      cell: (product) => product.category?.name ?? <span className="text-slate-400">Sin categoría</span>,
    },
    { key: 'price', header: 'Precio', align: 'right', cell: (product) => formatCurrency(product.price) },
    {
      key: 'stock',
      header: 'Stock',
      align: 'right',
      cell: (product) =>
        product.stock === 0 ? <Badge tone="danger">Agotado</Badge> : <span>{product.stock}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (product) =>
        product.is_active ? (
          <Badge tone="success">Activo</Badge>
        ) : (
          <Tooltip content="No se muestra en la tienda">
            <Badge>Inactivo</Badge>
          </Tooltip>
        ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      cell: (product) => (
        <div className="flex justify-end gap-1">
          <Link
            to={paths.admin.productEdit(product.id)}
            aria-label={`Editar ${product.name}`}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <PencilIcon className="size-4" />
          </Link>
          <IconButton
            label="Eliminar"
            tone="danger"
            icon={<TrashIcon className="size-4" />}
            onClick={() => onDelete(product)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={products}
      getRowKey={(product) => product.id}
      isLoading={isLoading}
      emptyMessage="No hay productos que coincidan con la búsqueda"
    />
  )
}
