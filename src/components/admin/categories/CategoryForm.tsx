import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/general/Button'
import { Input } from '@/components/general/Input'
import { Textarea } from '@/components/general/Textarea'
import { categorySchema, type CategoryFormValues } from '@/schemas/category.schema'

type CategoryFormProps = {
  defaultValues?: CategoryFormValues
  isSubmitting?: boolean
  onSubmit: (values: CategoryFormValues) => void
  onCancel: () => void
}

export function CategoryForm({ defaultValues, isSubmitting = false, onSubmit, onCancel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ?? { name: '', description: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input label="Nombre" required autoFocus error={errors.name?.message} {...register('name')} />
      <Textarea label="Descripción" rows={3} error={errors.description?.message} {...register('description')} />
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  )
}
