import { useState } from 'react'
import { CategoriesTable } from '@/components/admin/categories/CategoriesTable'
import { CategoryFormModal } from '@/components/admin/categories/CategoryFormModal'
import { Button } from '@/components/general/Button'
import { ConfirmDialog } from '@/components/general/ConfirmDialog'
import { ErrorState } from '@/components/general/ErrorState'
import { PlusIcon } from '@/components/general/Icons'
import { PageHeader } from '@/components/general/PageHeader'
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategories'
import type { CategoryFormValues } from '@/schemas/category.schema'
import type { CategoryWithCount } from '@/types'

type FormState = { open: false } | { open: true; category: CategoryWithCount | null }

export function CategoriesView() {
  const [form, setForm] = useState<FormState>({ open: false })
  const [toDelete, setToDelete] = useState<CategoryWithCount | null>(null)

  const categories = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const editing = form.open ? form.category : null
  const closeForm = () => setForm({ open: false })

  const handleSubmit = (values: CategoryFormValues) => {
    if (editing) {
      updateCategory.mutate({ id: editing.id, values }, { onSuccess: closeForm })
    } else {
      createCategory.mutate(values, { onSuccess: closeForm })
    }
  }

  const confirmDelete = () => {
    if (!toDelete) return
    deleteCategory.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })
  }

  const productsInCategory = toDelete?.products[0]?.count ?? 0

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Organiza los productos del catálogo"
        actions={
          <Button icon={<PlusIcon className="size-4" />} onClick={() => setForm({ open: true, category: null })}>
            Nueva categoría
          </Button>
        }
      />

      {categories.error ? (
        <ErrorState error={categories.error} onRetry={() => void categories.refetch()} />
      ) : (
        <CategoriesTable
          categories={categories.data ?? []}
          isLoading={categories.isLoading}
          onEdit={(category) => setForm({ open: true, category })}
          onDelete={setToDelete}
        />
      )}

      <CategoryFormModal
        isOpen={form.open}
        category={editing}
        isSubmitting={createCategory.isPending || updateCategory.isPending}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />

      <ConfirmDialog
        isOpen={Boolean(toDelete)}
        title="Eliminar categoría"
        message={
          productsInCategory > 0
            ? `"${toDelete?.name}" tiene ${productsInCategory} producto(s). Quedarán sin categoría. ¿Continuar?`
            : `¿Seguro que quieres eliminar "${toDelete?.name}"?`
        }
        confirmLabel="Eliminar"
        isLoading={deleteCategory.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  )
}
