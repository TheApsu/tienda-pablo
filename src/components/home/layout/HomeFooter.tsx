import { Link } from 'react-router-dom'
import { storeConfig } from '@/config/store.config'
import { paths } from '@/router/paths'

const CURRENT_YEAR = new Date().getFullYear()

export function HomeFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>
          © {CURRENT_YEAR} {storeConfig.name}
        </p>
        <Link to={paths.admin.login} className="hover:text-slate-700">
          Administración
        </Link>
      </div>
    </footer>
  )
}
