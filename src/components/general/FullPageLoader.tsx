import { Spinner } from './Spinner'

type FullPageLoaderProps = {
  label?: string
}

export function FullPageLoader({ label = 'Cargando...' }: FullPageLoaderProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-slate-500">
      <Spinner className="size-8 text-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
