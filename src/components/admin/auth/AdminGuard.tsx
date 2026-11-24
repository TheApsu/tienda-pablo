import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullPageLoader } from '@/components/general/FullPageLoader'
import { paths } from '@/router/paths'
import { useAuthStore } from '@/store/auth.store'

/** Protege las rutas del panel: requiere sesión y rol de administrador. */
export function AdminGuard() {
  const location = useLocation()
  const status = useAuthStore((state) => state.status)
  const session = useAuthStore((state) => state.session)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  if (status === 'loading') return <FullPageLoader label="Verificando sesión..." />

  if (!session || !isAdmin) {
    return <Navigate to={paths.admin.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
