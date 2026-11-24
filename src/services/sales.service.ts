import { supabase } from '@/lib/supabase'
import { emptyToNull } from '@/lib/utils'
import type { SaleReportFormValues } from '@/schemas/sale.schema'
import type { CartItem, DashboardStats, Sale, SaleFilters, SaleStatus, SaleWithItems } from '@/types'
import { storageService } from './storage.service'

export type CreateSaleReportInput = SaleReportFormValues & { items: CartItem[] }

export type ReviewSaleInput = {
  id: string
  status: SaleStatus
  adminNotes: string
}

export const salesService = {
  /** Lo usa el cliente: sube la foto del comprobante y registra la venta. */
  async createReport({ items, proof, ...customer }: CreateSaleReportInput): Promise<string> {
    const proofPath = await storageService.uploadPaymentProof(proof)

    const { data, error } = await supabase.rpc('create_sale', {
      p_customer_name: customer.customerName,
      p_customer_email: customer.customerEmail,
      p_customer_phone: emptyToNull(customer.customerPhone) ?? undefined,
      p_reference: customer.reference,
      p_proof_path: proofPath,
      p_items: items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
    })

    if (error) throw error
    return data
  },

  async getAll(filters: SaleFilters = {}): Promise<Sale[]> {
    let query = supabase.from('sales').select('*').order('created_at', { ascending: false })
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.limit) query = query.limit(filters.limit)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getById(id: string): Promise<SaleWithItems> {
    const { data, error } = await supabase
      .from('sales')
      .select('*, items:sale_items(*)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async review({ id, status, adminNotes }: ReviewSaleInput): Promise<Sale> {
    const { data, error } = await supabase
      .from('sales')
      .update({ status, admin_notes: emptyToNull(adminNotes) })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(sale: Sale): Promise<void> {
    const { error } = await supabase.from('sales').delete().eq('id', sale.id)
    if (error) throw error
    await storageService.removePaymentProof(sale.proof_path)
  },

  getProofUrl: (path: string) => storageService.getPaymentProofUrl(path),

  async getDashboardStats(): Promise<DashboardStats> {
    const [products, categories, pending, approved] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('sales').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('sales').select('total').eq('status', 'approved'),
    ])

    const failed = [products, categories, pending, approved].find((result) => result.error)
    if (failed?.error) throw failed.error

    return {
      products: products.count ?? 0,
      categories: categories.count ?? 0,
      pendingSales: pending.count ?? 0,
      approvedTotal: (approved.data ?? []).reduce((sum, sale) => sum + Number(sale.total), 0),
    }
  },
}
