import { DataTable, type DataTableColumn } from '@/components/general/DataTable'
import { formatCurrency } from '@/lib/utils'
import type { SaleItem } from '@/types'

const columns: DataTableColumn<SaleItem>[] = [
  { key: 'product', header: 'Producto', cell: (item) => <span className="font-medium text-slate-900">{item.product_name}</span> },
  { key: 'price', header: 'Precio', align: 'right', cell: (item) => formatCurrency(item.unit_price) },
  { key: 'quantity', header: 'Cant.', align: 'center', cell: (item) => item.quantity },
  { key: 'subtotal', header: 'Subtotal', align: 'right', cell: (item) => formatCurrency(item.subtotal) },
]

export function SaleItemsTable({ items }: { items: SaleItem[] }) {
  return <DataTable columns={columns} rows={items} getRowKey={(item) => item.id} emptyMessage="Sin productos" />
}
