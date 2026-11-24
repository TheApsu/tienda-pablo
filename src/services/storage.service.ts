import { STORAGE_BUCKETS } from '@/config/constants'
import { supabase } from '@/lib/supabase'
import { getFileExtension } from '@/lib/utils'

type Bucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

async function upload(bucket: Bucket, folder: string, file: File): Promise<string> {
  const path = `${folder}/${crypto.randomUUID()}.${getFileExtension(file)}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (error) throw error
  return path
}

async function remove(bucket: Bucket, path: string | null | undefined): Promise<void> {
  if (!path) return
  const { error } = await supabase.storage.from(bucket).remove([path])
  // No interrumpimos el flujo si falla el borrado de un archivo huérfano.
  if (error) console.warn(`No se pudo eliminar ${bucket}/${path}:`, error.message)
}

export const storageService = {
  uploadProductImage: (file: File) => upload(STORAGE_BUCKETS.products, 'catalog', file),

  removeProductImage: (path: string | null | undefined) => remove(STORAGE_BUCKETS.products, path),

  getProductImageUrl(path: string | null | undefined): string | null {
    if (!path) return null
    return supabase.storage.from(STORAGE_BUCKETS.products).getPublicUrl(path).data.publicUrl
  },

  uploadPaymentProof: (file: File) => {
    const month = new Date().toISOString().slice(0, 7) // YYYY-MM
    return upload(STORAGE_BUCKETS.paymentProofs, month, file)
  },

  removePaymentProof: (path: string | null | undefined) => remove(STORAGE_BUCKETS.paymentProofs, path),

  async getPaymentProofUrl(path: string, expiresInSeconds = 60 * 60): Promise<string> {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.paymentProofs)
      .createSignedUrl(path, expiresInSeconds)
    if (error) throw error
    return data.signedUrl
  },
}
