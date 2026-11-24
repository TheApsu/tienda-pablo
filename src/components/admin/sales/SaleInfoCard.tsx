import { Card } from '@/components/general/Card'
import { DescriptionItem } from '@/components/general/DescriptionItem'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Sale } from '@/types'
import { SaleStatusBadge } from './SaleStatusBadge'

export function SaleInfoCard({ sale }: { sale: Sale }) {
  return (
    <Card title="Datos del reporte" actions={<SaleStatusBadge status={sale.status} />}>
      <dl className="flex flex-col gap-3">
        <DescriptionItem label="Cliente" value={sale.customer_name} />
        <DescriptionItem
          label="Correo"
          value={
            <a href={`mailto:${sale.customer_email}`} className="text-brand-600 hover:underline">
              {sale.customer_email}
            </a>
          }
        />
        <DescriptionItem label="Teléfono" value={sale.customer_phone || '—'} />
        <DescriptionItem label="Referencia de pago" value={<code className="rounded bg-slate-100 px-1.5 py-0.5">{sale.reference}</code>} />
        <DescriptionItem label="Reportada" value={formatDate(sale.created_at)} />
        {sale.reviewed_at && <DescriptionItem label="Revisada" value={formatDate(sale.reviewed_at)} />}
        <div className="border-t border-slate-100 pt-3">
          <DescriptionItem label="Total" value={<span className="text-lg">{formatCurrency(sale.total)}</span>} />
        </div>
      </dl>
    </Card>
  )
}
