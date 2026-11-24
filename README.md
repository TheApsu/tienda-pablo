# Tienda Pablo

Tienda pequeña con catálogo, carrito y **reporte de pagos** (el cliente envía la referencia y la foto del comprobante) más un **panel de administración** para gestionar productos, categorías y aprobar o rechazar ventas.

## Stack

| Uso | Librería |
| --- | --- |
| UI | React 19 + TypeScript + Vite |
| Estilos | Tailwind CSS 4 |
| Rutas | react-router-dom 7 |
| Datos del servidor | @tanstack/react-query 5 |
| Estado global | zustand 5 (sesión, carrito, toasts, UI) |
| Formularios | react-hook-form + zod |
| Backend | Supabase (Postgres, Auth, Storage) |

## Puesta en marcha

1. **Crea un proyecto en [Supabase](https://supabase.com).**
2. **Crea el esquema:** abre *SQL Editor*, pega y ejecuta [`supabase/migrations/20261124000000_init.sql`](supabase/migrations/20261124000000_init.sql).
   Crea las tablas, las políticas RLS, la función `create_sale`, el trigger de stock y los buckets de Storage.
   (Opcional) Ejecuta [`supabase/seed.sql`](supabase/seed.sql) para cargar datos de ejemplo.
3. **Crea el usuario administrador:**
   - En *Authentication → Users → Add user*, crea un usuario con correo y contraseña (marca "Auto confirm").
   - En el *SQL Editor* dale permisos de admin:
     ```sql
     insert into public.admin_users (user_id)
     select id from auth.users where email = 'admin@tu-dominio.com';
     ```
   - Recomendado: desactiva los registros públicos en *Authentication → Sign In / Providers* (el panel solo deja entrar a los usuarios de `admin_users`, pero así nadie más crea cuentas).
4. **Variables de entorno:** copia `.env.example` como `.env` y rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (*Project Settings → API*).
5. **Arranca:**
   ```bash
   npm install
   npm run dev
   ```
   Tienda en `http://localhost:5173`, panel en `http://localhost:5173/admin`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Typecheck + build de producción |
| `npm run typecheck` | Solo comprobación de tipos |
| `npm run lint` | Lint con oxlint |
| `npm run gen:types` | Regenera `src/types/database.types.ts` desde Supabase (requiere `npx supabase login` y `SUPABASE_PROJECT_ID`) |

## Estructura y convenciones

```
src/
├── views/                  # Una vista por ruta. Solo orquestan: hooks + componentes importados.
│   ├── home/               #   Catálogo, carrito, checkout (reporte de pago), éxito
│   ├── auth/               #   Login del admin
│   └── admin/              #   Resumen, products/, categories/, sales/
├── components/             # TODOS los componentes viven aquí, nunca dentro de una vista
│   ├── general/            #   Reutilizables en cualquier lado: Button, Input, Modal, Header, Tooltip, DataTable...
│   ├── admin/
│   │   ├── products/       #   ProductsTable, ProductForm, ProductsFilters
│   │   ├── categories/     #   CategoriesTable, CategoryForm, CategoryFormModal
│   │   ├── sales/          #   SalesTable, SaleReviewForm, SaleProofCard...
│   │   ├── dashboard/      #   DashboardStats
│   │   ├── layout/         #   AdminLayout, AdminSidebar, AdminTopbar
│   │   └── auth/           #   AdminGuard, LoginForm, LoginCard
│   └── home/               #   ProductGrid, ProductCard, CartItemsList, SaleReportForm... (+ layout/)
├── hooks/                  # Hooks de React Query (useProducts, useCategories, useSales, useAuth) y utilidades
├── services/               # Acceso a Supabase (una capa por entidad + storage)
├── store/                  # Stores de zustand (auth, cart, toast, ui)
├── schemas/                # Esquemas zod de los formularios
├── types/                  # Tipos de la base de datos y del dominio
├── router/                 # Definición de rutas y constantes de paths
├── config/                 # Constantes y datos de la tienda (nombre, moneda, instrucciones de pago)
└── lib/                    # Cliente de Supabase, QueryClient, utilidades
```

Reglas:

- **Las vistas no declaran componentes.** Una vista solo usa hooks y compone componentes importados de `components/`.
- **Un componente por archivo**, en la carpeta del módulo donde se usa; si se reutiliza en varios módulos va en `components/general`.
- **Flujo de datos:** `view → hook (React Query) → service → Supabase`. Los componentes no llaman a Supabase directamente.
- **Estado:** datos del servidor en React Query; estado de cliente (sesión, carrito, toasts, menú) en zustand.
- **Formularios:** react-hook-form + `zodResolver`; los tipos se infieren del esquema (`z.input` / `z.output`).
- Alias `@/` → `src/`.

## Cómo funcionan las ventas

1. El cliente arma su carrito (persistido en `localStorage` con zustand) y va a **Reportar pago**.
2. Completa sus datos, la **referencia** y la **foto del comprobante**. La foto se sube al bucket privado `payment-proofs` y se llama a la función `create_sale`, que **calcula precios y total en el servidor** y valida stock y productos activos.
3. En el panel, el admin ve la venta como **Pendiente**, revisa el comprobante (URL firmada temporal) y la **aprueba** o **rechaza** con notas internas.
4. Al **aprobar** se descuenta el stock automáticamente (trigger). Si una venta aprobada se rechaza o vuelve a pendiente, el stock se devuelve.

## Seguridad (RLS)

- Catálogo (`categories`, `products` activos): lectura pública. Escritura solo admin.
- `sales` / `sale_items`: solo el admin puede leer, actualizar y borrar. Los clientes únicamente crean ventas mediante `create_sale`.
- Storage: `products` es público para lectura y lo escribe el admin; `payment-proofs` es privado: cualquiera puede subir, solo el admin puede ver y borrar.
- "Admin" = usuario de Supabase Auth presente en la tabla `admin_users` (función `is_admin()`).
