import { z } from 'zod'
import { requiredImageSchema } from './shared.schema'

export const saleReportSchema = z.object({
  customerName: z.string().trim().min(3, 'Ingresa tu nombre completo').max(120, 'Máximo 120 caracteres'),
  customerEmail: z.email('Ingresa un correo válido'),
  customerPhone: z.string().trim().max(30, 'Máximo 30 caracteres'),
  reference: z
    .string()
    .trim()
    .min(4, 'La referencia debe tener al menos 4 caracteres')
    .max(60, 'Máximo 60 caracteres'),
  proof: requiredImageSchema('Adjunta la foto del comprobante de pago'),
})

export type SaleReportFormInput = z.input<typeof saleReportSchema>
export type SaleReportFormValues = z.output<typeof saleReportSchema>

export const saleReviewSchema = z.object({
  adminNotes: z.string().trim().max(500, 'Máximo 500 caracteres'),
})

export type SaleReviewFormValues = z.infer<typeof saleReviewSchema>
