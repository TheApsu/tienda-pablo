import { NavLink } from 'react-router-dom'
import { BoxIcon, ChartIcon, HomeIcon, ReceiptIcon, TagIcon } from '@/components/general/Icons'
import { storeConfig } from '@/config/store.config'
import { useDashboardStats } from '@/hooks/useSales'
import { cn } from '@/lib/utils'
import { paths } from '@/router/paths'
import { useUiStore } from '@/store/ui.store'

const links = [
  { to: paths.admin.dashboard, label: 'Resumen', icon: ChartIcon, end: true },
  { to: paths.admin.products, label: 'Productos', icon: BoxIcon },
  { to: paths.admin.categories, label: 'Categorías', icon: TagIcon },
  { to: paths.admin.sales, label: 'Ventas', icon: ReceiptIcon, showPending: true },
]

export function AdminSidebar() {
  const isOpen = useUiStore((state) => state.isSidebarOpen)
  const close = useUiStore((state) => state.closeSidebar)
  const { data: stats } = useDashboardStats()

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={close} aria-hidden="true" />}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <span className="text-lg font-bold text-slate-900">{storeConfig.name}</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {links.map(({ to, label, icon: Icon, end, showPending }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={close}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              <Icon className="size-5" />
              <span className="flex-1">{label}</span>
              {showPending && Boolean(stats?.pendingSales) && (
                <span className="rounded-full bg-amber-100 px-2 text-xs font-semibold text-amber-700">
                  {stats?.pendingSales}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <NavLink
            to={paths.home}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <HomeIcon className="size-5" />
            Ver tienda
          </NavLink>
        </div>
      </aside>
    </>
  )
}
