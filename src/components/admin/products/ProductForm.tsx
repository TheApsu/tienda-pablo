import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/general/Button'
import { Card } from '@/components/general/Card'
import { ImageInput } from '@/components/general/ImageInput'
import { Input } from '@/components/general/Input'
import { Select } from '@/components/general/Select'
import { Switch } from '@/components/general/Switch'
import { Textarea } from '@/components/general/Textarea'
import { productSchema, type ProductFormInput, type ProductFormValues } from '@/schemas/product.schema'
import type { Category } from '@/types'

const EMPTY_VALUES: ProductFormInput = {
  name: '',
  description: '',
  categoryId: '',
  price: '',
  stock: '0',
  isActive: true,
  image: null,
}

type ProductFormProps = {
  categories: Category[]
  defaultValues?: Partial<ProductFormInput>
  currentImageUrl?: string | null
  submitLabel?: string
  isSubmitting?: boolean
  onSubmit: (values: ProductFormValues) => void
  onCancel: () => void
}

export function ProductForm({
  categories,
  defaultValues,
  currentImageUrl,
  submitLabel = 'Guardar',
  isSubmitting = false,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...EMPTY_VALUES, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <Card title="Información del producto">
        <div className="flex flex-col gap-4">
          <Input label="Nombre" required error={errors.name?.message} {...register('name')} />
          <Textarea label="Descripción" error={errors.description?.message} {...register('description')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Precio"
              required
              inputMode="decimal"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price')}
            />
            <Input label="Stock" required inputMode="numeric" error={errors.stock?.message} {...register('stock')} />
          </div>
          <Select
            label="Categoría"
            placeholder="Sin categoría"
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
            error={errors.categoryId?.message}
            {...register('categoryId')}
          />
          <Switch
            label="Producto activo"
            description="Los productos inactivos no se muestran en la tienda."
            {...register('isActive')}
          />
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card title="Imagen">
          <Controller
            control={control}
            name="image"
            render={({ field, fieldState }) => (
              <ImageInput
                value={field.value ?? null}
                onChange={field.onChange}
                onBlur={field.onBlur}
                currentUrl={currentImageUrl}
                error={fieldState.error?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Card>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={isSubmitting} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty && Boolean(defaultValues)} className="flex-1">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  )
}
