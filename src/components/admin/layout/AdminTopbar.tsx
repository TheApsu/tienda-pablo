import { Button } from '@/components/general/Button'
import { LogoutIcon, MenuIcon } from '@/components/general/Icons'
import { useLogout } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { useUiStore } from '@/store/ui.store'

export function AdminTopbar() {
  const email = useAuthStore((state) => state.session?.user.email)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Abrir menú"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <MenuIcon />
      </button>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 sm:inline">{email}</span>
        <Button
          variant="ghost"
          size="sm"
          icon={<LogoutIcon className="size-4" />}
          isLoading={logout.isPending}
          onClick={() => logout.mutate()}
        >
          Salir
        </Button>
      </div>
    </header>
  )
}
