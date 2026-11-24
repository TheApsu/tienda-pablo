import { MutationCache, QueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '@/lib/errors'
import { toast } from '@/store/toast.store'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    // Muestra un toast con el error de cualquier mutación, salvo que la
    // mutación indique `meta: { silent: true }`.
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.silent) return
      toast.error(getErrorMessage(error))
    },
  }),
})
