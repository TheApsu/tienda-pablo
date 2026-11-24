import { useNavigate } from 'react-router-dom'
import { DataTable, type DataTableColumn } from '@/components/general/DataTable'
import { IconButton } from '@/components/general/IconButton'
import { EyeIcon, TrashIcon } from '@/components/general/Icons'
import { formatCurrency, formatDate } from '@/lib/utils'
import { paths } from '@/router/paths'
import type { Sale } from '@/types'
import { SaleStatusBadge } from './SaleStatusBadge'

type SalesTableProps = {
  sales: Sale[]
  isLoading?: boolean
  emptyMessage?: string
  onDelete?: (sale: Sale) => void
}

export function SalesTable({ sales, isLoading, emptyMessage = 'No hay ventas registradas', onDelete }: SalesTableProps) {
  const navigate = useNavigate()
  const openDetail = (sale: Sale) => navigate(paths.admin.saleDetail(sale.id))

  const columns: DataTableColumn<Sale>[] = [
    { key: 'date', header: 'Fecha', cell: (sale) => <span className="whitespace-nowrap">{formatDate(sale.created_at)}</span> },
    {
      key: 'customer',
      header: 'Cliente',
      cell: (sale) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{sale.customer_name}</span>
          <span className="text-xs text-slate-500">{sale.customer_email}</span>
        </div>
      ),
    },
    { key: 'reference', header: 'Referencia', cell: (sale) => <code className="text-xs">{sale.reference}</code> },
    { key: 'total', header: 'Total', align: 'right', cell: (sale) => formatCurrency(sale.total) },
    { key: 'status', header: 'Estado', cell: (sale) => <SaleStatusBadge status={sale.status} /> },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      cell: (sale) => (
        // Evita que el clic en las acciones abra el detalle de la fila.
        <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
          <IconButton label="Ver detalle" icon={<EyeIcon className="size-4" />} onClick={() => openDetail(sale)} />
          {onDelete && (
            <IconButton
              label="Eliminar"
              tone="danger"
              icon={<TrashIcon className="size-4" />}
              onClick={() => onDelete(sale)}
            />
          )}
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={sales}
      getRowKey={(sale) => sale.id}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      onRowClick={openDetail}
    />
  )
}
