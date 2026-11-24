import { ButtonLink } from '@/components/general/ButtonLink'
import { EmptyState } from '@/components/general/EmptyState'
import { SearchIcon } from '@/components/general/Icons'
import { paths } from '@/router/paths'

export function NotFoundView() {
  return (
    <div className="mx-auto max-w-xl p-6 pt-24">
      <EmptyState
        icon={<SearchIcon />}
        title="Página no encontrada"
        description="La dirección que buscas no existe o fue movida."
        action={<ButtonLink to={paths.home}>Ir al inicio</ButtonLink>}
      />
    </div>
  )
}
