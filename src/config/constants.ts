import type { SaleStatus } from '@/types'

export const STORAGE_BUCKETS = {
  products: 'products',
  paymentProofs: 'payment-proofs',
} as const

export const MAX_IMAGE_SIZE_MB = 5
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const SALE_STATUS_LABEL: Record<SaleStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
}

export const SALE_STATUSES: SaleStatus[] = ['pending', 'approved', 'rejected']
