export const paths = {
  home: '/',
  cart: '/carrito',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/exito',
  admin: {
    login: '/admin/login',
    dashboard: '/admin',
    products: '/admin/productos',
    productCreate: '/admin/productos/nuevo',
    productEdit: (id: string) => `/admin/productos/${id}/editar`,
    categories: '/admin/categorias',
    sales: '/admin/ventas',
    saleDetail: (id: string) => `/admin/ventas/${id}`,
  },
} as const
