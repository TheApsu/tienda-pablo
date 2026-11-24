import { createBrowserRouter } from 'react-router-dom'
import { FullPageLoader } from '@/components/general/FullPageLoader'
import { RouteErrorBoundary } from '@/components/general/RouteErrorBoundary'
import { HomeLayout } from '@/components/home/layout/HomeLayout'
import { CartView } from '@/views/home/CartView'
import { CheckoutSuccessView } from '@/views/home/CheckoutSuccessView'
import { CheckoutView } from '@/views/home/CheckoutView'
import { HomeView } from '@/views/home/HomeView'
import { NotFoundView } from '@/views/NotFoundView'
import { paths } from './paths'

/**
 * El panel de administración se carga bajo demanda (code splitting) para que
 * los clientes de la tienda no descarguen ese código.
 */
export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    hydrateFallbackElement: <FullPageLoader />,
    children: [
      {
        path: paths.home,
        element: <HomeLayout />,
        children: [
          { index: true, element: <HomeView /> },
          { path: paths.cart, element: <CartView /> },
          { path: paths.checkout, element: <CheckoutView /> },
          { path: paths.checkoutSuccess, element: <CheckoutSuccessView /> },
        ],
      },
      {
        path: paths.admin.login,
        lazy: async () => ({ Component: (await import('@/views/auth/LoginView')).LoginView }),
      },
      {
        path: paths.admin.dashboard,
        lazy: async () => ({ Component: (await import('@/components/admin/auth/AdminGuard')).AdminGuard }),
        children: [
          {
            lazy: async () => ({ Component: (await import('@/components/admin/layout/AdminLayout')).AdminLayout }),
            children: [
              {
                index: true,
                lazy: async () => ({ Component: (await import('@/views/admin/DashboardView')).DashboardView }),
              },
              {
                path: paths.admin.products,
                lazy: async () => ({ Component: (await import('@/views/admin/products/ProductsView')).ProductsView }),
              },
              {
                path: paths.admin.productCreate,
                lazy: async () => ({
                  Component: (await import('@/views/admin/products/ProductCreateView')).ProductCreateView,
                }),
              },
              {
                path: `${paths.admin.products}/:id/editar`,
                lazy: async () => ({
                  Component: (await import('@/views/admin/products/ProductEditView')).ProductEditView,
                }),
              },
              {
                path: paths.admin.categories,
                lazy: async () => ({
                  Component: (await import('@/views/admin/categories/CategoriesView')).CategoriesView,
                }),
              },
              {
                path: paths.admin.sales,
                lazy: async () => ({ Component: (await import('@/views/admin/sales/SalesView')).SalesView }),
              },
              {
                path: `${paths.admin.sales}/:id`,
                lazy: async () => ({ Component: (await import('@/views/admin/sales/SaleDetailView')).SaleDetailView }),
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundView /> },
    ],
  },
])
