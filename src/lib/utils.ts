import { storeConfig } from '@/config/store.config'

type ClassValue = string | false | null | undefined

/** Une clases condicionales: cn('a', cond && 'b') */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}

const currencyFormatter = new Intl.NumberFormat(storeConfig.locale, {
  style: 'currency',
  currency: storeConfig.currency,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

const dateFormatter = new Intl.DateTimeFormat(storeConfig.locale, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value))
}

export function getFileExtension(file: File): string {
  const fromName = file.name.split('.').pop()
  if (fromName && fromName !== file.name) return fromName.toLowerCase()
  return file.type.split('/').pop() ?? 'bin'
}

/** Convierte '' en null para columnas opcionales. */
export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}
