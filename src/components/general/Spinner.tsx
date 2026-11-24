import { cn } from '@/lib/utils'

type SpinnerProps = {
  className?: string
  label?: string
}

export function Spinner({ className, label = 'Cargando' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={cn(
          'size-5 animate-spin rounded-full border-2 border-current border-r-transparent',
          className,
        )}
      />
    </span>
  )
}
