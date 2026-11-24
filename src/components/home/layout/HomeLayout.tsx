import { Outlet } from 'react-router-dom'
import { Header } from '@/components/general/Header'
import { storeConfig } from '@/config/store.config'
import { paths } from '@/router/paths'
import { CartButton } from '../CartButton'
import { HomeFooter } from './HomeFooter'

const links = [
  { to: paths.home, label: 'Catálogo', end: true },
  { to: paths.cart, label: 'Carrito' },
]

export function HomeLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header brand={storeConfig.name} links={links} actions={<CartButton />} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  )
}
