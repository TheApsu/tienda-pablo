import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/general/Button'
import { Card } from '@/components/general/Card'
import { ImageInput } from '@/components/general/ImageInput'
import { Input } from '@/components/general/Input'
import { saleReportSchema, type SaleReportFormInput, type SaleReportFormValues } from '@/schemas/sale.schema'

type SaleReportFormProps = {
  isSubmitting?: boolean
  onSubmit: (values: SaleReportFormValues) => void
}

export function SaleReportForm({ isSubmitting = false, onSubmit }: SaleReportFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SaleReportFormInput, unknown, SaleReportFormValues>({
    resolver: zodResolver(saleReportSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      reference: '',
      proof: null,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Card title="Tus datos">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Nombre completo"
              required
              autoComplete="name"
              error={errors.customerName?.message}
              {...register('customerName')}
            />
          </div>
          <Input
            label="Correo"
            type="email"
            required
            autoComplete="email"
            error={errors.customerEmail?.message}
            {...register('customerEmail')}
          />
          <Input
            label="Teléfono"
            type="tel"
            autoComplete="tel"
            hint="Opcional"
            error={errors.customerPhone?.message}
            {...register('customerPhone')}
          />
        </div>
      </Card>

      <Card title="Datos del pago">
        <div className="flex flex-col gap-4">
          <Input
            label="Número de referencia"
            required
            placeholder="Ej.: 00123456"
            hint="El número que aparece en el comprobante de tu banco"
            error={errors.reference?.message}
            {...register('reference')}
          />
          <Controller
            control={control}
            name="proof"
            render={({ field, fieldState }) => (
              <ImageInput
                label="Foto del comprobante"
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </Card>

      <Button type="submit" size="lg" isLoading={isSubmitting}>
        Enviar reporte de pago
      </Button>
    </form>
  )
}
