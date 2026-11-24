import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { LoginFormValues } from '@/schemas/auth.schema'

export const authService = {
  async signIn({ email, password }: LoginFormValues): Promise<Session> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.session
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async checkIsAdmin(): Promise<boolean> {
    const { data, error } = await supabase.rpc('is_admin')
    if (error) throw error
    return data
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
    return () => data.subscription.unsubscribe()
  },
}
