import type { Session } from '@supabase/supabase-js'
import { create } from 'zustand'

export type AuthStatus = 'loading' | 'ready'

type AuthState = {
  session: Session | null
  isAdmin: boolean
  status: AuthStatus
  setAuth: (session: Session | null, isAdmin: boolean) => void
  setLoading: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  isAdmin: false,
  status: 'loading',
  setAuth: (session, isAdmin) => set({ session, isAdmin, status: 'ready' }),
  setLoading: () => set({ status: 'loading' }),
}))
