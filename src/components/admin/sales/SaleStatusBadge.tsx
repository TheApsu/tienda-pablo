import { Badge, type BadgeTone } from '@/components/general/Badge'
import { SALE_STATUS_LABEL } from '@/config/constants'
import type { SaleStatus } from '@/types'

const tones: Record<SaleStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

export function SaleStatusBadge({ status }: { status: SaleStatus }) {
  return <Badge tone={tones[status]}>{SALE_STATUS_LABEL[status]}</Badge>
}
