import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/general/Toaster'
import { useAuthListener } from '@/hooks/useAuth'
import { router } from '@/router'

export default function App() {
  useAuthListener()

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}
