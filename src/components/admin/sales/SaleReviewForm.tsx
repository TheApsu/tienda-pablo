import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/general/Button'
import { Card } from '@/components/general/Card'
import { CheckIcon, XIcon } from '@/components/general/Icons'
import { Textarea } from '@/components/general/Textarea'
import { saleReviewSchema, type SaleReviewFormValues } from '@/schemas/sale.schema'
import type { Sale, SaleStatus } from '@/types'

type SaleReviewFormProps = {
  sale: Sale
  isSubmitting?: boolean
  onReview: (status: SaleStatus, values: SaleReviewFormValues) => void
}

export function SaleReviewForm({ sale, isSubmitting = false, onReview }: SaleReviewFormProps) {
  const [target, setTarget] = useState<SaleStatus | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaleReviewFormValues>({
    resolver: zodResolver(saleReviewSchema),
    defaultValues: { adminNotes: sale.admin_notes ?? '' },
  })

  const submit = (status: SaleStatus) => {
    setTarget(status)
    void handleSubmit((values) => onReview(status, values))()
  }

  const isPending = sale.status === 'pending'

  return (
    <Card
      title="Revisión"
      description={
        isPending
          ? 'Verifica la referencia y el comprobante antes de aprobar. Al aprobar se descuenta el stock.'
          : 'Esta venta ya fue revisada. Puedes cambiar su estado si fue un error.'
      }
    >
      <form onSubmit={(event) => event.preventDefault()} noValidate className="flex flex-col gap-4">
        <Textarea
          label="Notas internas"
          rows={3}
          placeholder="Ej.: pago verificado en el banco"
          error={errors.adminNotes?.message}
          {...register('adminNotes')}
        />
        <div className="flex flex-wrap gap-2">
          {sale.status !== 'approved' && (
            <Button
              variant="success"
              icon={<CheckIcon className="size-4" />}
              isLoading={isSubmitting && target === 'approved'}
              disabled={isSubmitting}
              onClick={() => submit('approved')}
            >
              Aprobar
            </Button>
          )}
          {sale.status !== 'rejected' && (
            <Button
              variant="danger"
              icon={<XIcon className="size-4" />}
              isLoading={isSubmitting && target === 'rejected'}
              disabled={isSubmitting}
              onClick={() => submit('rejected')}
            >
              Rechazar
            </Button>
          )}
          {!isPending && (
            <Button
              variant="secondary"
              isLoading={isSubmitting && target === 'pending'}
              disabled={isSubmitting}
              onClick={() => submit('pending')}
            >
              Volver a pendiente
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}
