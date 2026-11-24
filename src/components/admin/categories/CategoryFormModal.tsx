import { Modal } from '@/components/general/Modal'
import type { CategoryFormValues } from '@/schemas/category.schema'
import type { Category } from '@/types'
import { CategoryForm } from './CategoryForm'

type CategoryFormModalProps = {
  isOpen: boolean
  /** Categoría a editar; `null` para crear una nueva. */
  category: Category | null
  isSubmitting?: boolean
  onSubmit: (values: CategoryFormValues) => void
  onClose: () => void
}

export function CategoryFormModal({ isOpen, category, isSubmitting, onSubmit, onClose }: CategoryFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title={category ? 'Editar categoría' : 'Nueva categoría'}
    >
      <CategoryForm
        key={category?.id ?? 'new'}
        defaultValues={category ? { name: category.name, description: category.description ?? '' } : undefined}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
