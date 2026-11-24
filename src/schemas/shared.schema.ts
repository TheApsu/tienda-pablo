import { z } from 'zod'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from '@/config/constants'

export const imageFileSchema = z
  .instanceof(File, { error: 'Selecciona una imagen' })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Formato no permitido (usa JPG, PNG o WEBP)')
  .refine((file) => file.size <= MAX_IMAGE_SIZE_BYTES, `La imagen no puede superar ${MAX_IMAGE_SIZE_MB} MB`)

/** Imagen opcional: `null` significa "sin cambios / sin imagen". */
export const optionalImageSchema = imageFileSchema.nullable()

/** Imagen obligatoria: el formulario arranca en `null`, pero debe enviarse un archivo. */
export const requiredImageSchema = (message: string) =>
  imageFileSchema.nullable().transform((file, ctx) => {
    if (!file) {
      ctx.addIssue({ code: 'custom', message })
      return z.NEVER
    }
    return file
  })

/** Campo numérico que viene como texto desde un <input> */
export const numericStringSchema = (options: { label: string; integer?: boolean; min?: number }) => {
  const { label, integer = false, min = 0 } = options
  let numberSchema = z.number({ error: `${label} debe ser un número válido` }).min(min, `${label} no puede ser menor que ${min}`)
  if (integer) numberSchema = numberSchema.int(`${label} debe ser un número entero`)

  return z
    .string()
    .trim()
    .min(1, `${label} es obligatorio`)
    .transform((value) => Number(value.replace(',', '.')))
    .pipe(numberSchema)
}
