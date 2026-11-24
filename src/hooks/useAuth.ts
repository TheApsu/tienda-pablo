import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { queryClient } from '@/lib/queryClient'
import type { Session } from '@supabase/supabase-js'

async function resolveIsAdmin(session: Session | null): Promise<boolean> {
  if (!session) return false
  try {
    return await authService.checkIsAdmin()
  } catch {
    return false
  }
}

/** Sincroniza la sesión de Supabase con el store de Zustand. Usar una sola vez (App). */
export function useAuthListener() {
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    let active = true

    const sync = async (session: Session | null) => {
      const isAdmin = await resolveIsAdmin(session)
      if (active) setAuth(session, isAdmin)
    }

    authService
      .getSession()
      .then(sync)
      .catch(() => setAuth(null, false))

    const unsubscribe = authService.onAuthStateChange((session) => {
      // Supabase recomienda no llamar otras APIs dentro del callback: se difiere.
      setTimeout(() => void sync(session), 0)
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [setAuth])
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: async (values: Parameters<typeof authService.signIn>[0]) => {
      const session = await authService.signIn(values)
      const isAdmin = await resolveIsAdmin(session)
      if (!isAdmin) {
        await authService.signOut()
        throw new Error('Tu usuario no tiene permisos de administrador.')
      }
      return { session, isAdmin }
    },
    onSuccess: ({ session, isAdmin }) => setAuth(session, isAdmin),
  })
}

export function useLogout() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      setAuth(null, false)
      queryClient.removeQueries({ queryKey: ['sales'] })
      queryClient.removeQueries({ queryKey: ['dashboard'] })
    },
  })
}
