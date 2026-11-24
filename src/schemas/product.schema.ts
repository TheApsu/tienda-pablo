import { z } from 'zod'
import { numericStringSchema, optionalImageSchema } from './shared.schema'

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(120, 'Máximo 120 caracteres'),
  description: z.string().trim().max(1000, 'Máximo 1000 caracteres'),
  categoryId: z.string(),
  price: numericStringSchema({ label: 'El precio' }),
  stock: numericStringSchema({ label: 'El stock', integer: true }),
  isActive: z.boolean(),
  image: optionalImageSchema,
})

/** Valores tal como los maneja el formulario (inputs de texto). */
export type ProductFormInput = z.input<typeof productSchema>
/** Valores ya validados y transformados. */
export type ProductFormValues = z.output<typeof productSchema>
