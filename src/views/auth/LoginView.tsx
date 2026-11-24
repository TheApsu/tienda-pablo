import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginCard } from '@/components/admin/auth/LoginCard'
import { LoginForm } from '@/components/admin/auth/LoginForm'
import { FullPageLoader } from '@/components/general/FullPageLoader'
import { useLogin } from '@/hooks/useAuth'
import { paths } from '@/router/paths'
import type { LoginFormValues } from '@/schemas/auth.schema'
import { useAuthStore } from '@/store/auth.store'

type LocationState = { from?: string } | null

export function LoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const status = useAuthStore((state) => state.status)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const login = useLogin()

  const redirectTo = (location.state as LocationState)?.from ?? paths.admin.dashboard

  if (status === 'loading') return <FullPageLoader />
  if (isAdmin) return <Navigate to={redirectTo} replace />

  const handleSubmit = (values: LoginFormValues) =>
    login.mutate(values, { onSuccess: () => navigate(redirectTo, { replace: true }) })

  return (
    <LoginCard>
      <LoginForm onSubmit={handleSubmit} isLoading={login.isPending} />
    </LoginCard>
  )
}
