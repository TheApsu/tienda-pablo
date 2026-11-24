import { useToastStore, type ToastType } from '@/store/toast.store'
import { cn } from '@/lib/utils'
import { AlertIcon, CheckIcon, InfoIcon, XIcon } from './Icons'

const styles: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-brand-200 bg-brand-50 text-brand-800',
}

const icons: Record<ToastType, typeof CheckIcon> = {
  success: CheckIcon,
  error: AlertIcon,
  info: InfoIcon,
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className={cn(
              'animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border p-4 text-sm shadow-lg',
              styles[toast.type],
            )}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <p className="flex-1">{toast.message}</p>
            <button type="button" aria-label="Cerrar" onClick={() => dismiss(toast.id)} className="opacity-60 hover:opacity-100">
              <XIcon className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
