import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { ButtonLink } from './ButtonLink'
import { AlertIcon } from './Icons'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Error desconocido'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <AlertIcon className="size-10 text-red-500" />
      <h1 className="text-xl font-semibold text-slate-900">Algo salió mal</h1>
      <p className="max-w-md text-sm text-slate-500">{message}</p>
      <ButtonLink to="/" variant="secondary">
        Volver al inicio
      </ButtonLink>
    </div>
  )
}
