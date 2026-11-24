import { AlertIcon } from './Icons'

/** Se muestra si faltan las variables de entorno de Supabase. */
export function ConfigMissing() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-900">
        <div className="mb-3 flex items-center gap-2">
          <AlertIcon className="size-6" />
          <h1 className="text-lg font-semibold">Falta configurar Supabase</h1>
        </div>
        <p className="text-sm">
          Crea un archivo <code className="rounded bg-amber-100 px-1">.env</code> en la raíz del proyecto a partir de{' '}
          <code className="rounded bg-amber-100 px-1">.env.example</code> con{' '}
          <code className="rounded bg-amber-100 px-1">VITE_SUPABASE_URL</code> y{' '}
          <code className="rounded bg-amber-100 px-1">VITE_SUPABASE_ANON_KEY</code>, y reinicia el servidor de
          desarrollo.
        </p>
      </div>
    </div>
  )
}
