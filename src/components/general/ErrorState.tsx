import { getErrorMessage } from '@/lib/errors'
import { Button } from './Button'
import { AlertIcon } from './Icons'

type ErrorStateProps = {
  error: unknown
  title?: string
  onRetry?: () => void
}

export function ErrorState({ error, title = 'No pudimos cargar la información', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <AlertIcon className="size-8 text-red-500" />
      <div>
        <h3 className="font-semibold text-red-800">{title}</h3>
        <p className="mt-1 text-sm text-red-700">{getErrorMessage(error)}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
