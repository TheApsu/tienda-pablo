import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(80, 'Máximo 80 caracteres'),
  description: z.string().trim().max(500, 'Máximo 500 caracteres'),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
