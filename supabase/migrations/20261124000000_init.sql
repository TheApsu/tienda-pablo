-- =====================================================================
-- Esquema inicial: categorías, productos, ventas (reportes de pago),
-- administradores, storage y políticas RLS.
--
-- Ejecutar en Supabase -> SQL Editor (o con `npx supabase db push`).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type public.sale_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------
-- Administradores
-- Solo los usuarios de auth.users que estén en esta tabla pueden
-- gestionar el panel. Ver README para dar de alta al primer admin.
-- ---------------------------------------------------------------------
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------
-- Utilidad: updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Categorías
-- ---------------------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 2 and 80),
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Productos
-- ---------------------------------------------------------------------
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name        text not null check (char_length(name) between 2 and 120),
  description text,
  price       numeric(12, 2) not null check (price >= 0),
  stock       integer not null default 0 check (stock >= 0),
  image_path  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);
create index products_is_active_idx on public.products (is_active);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Ventas (reporte de pago del cliente: referencia + foto)
-- ---------------------------------------------------------------------
create table public.sales (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  customer_email text not null,
  customer_phone text,
  reference      text not null,
  proof_path     text not null,
  total          numeric(12, 2) not null default 0,
  status         public.sale_status not null default 'pending',
  admin_notes    text,
  reviewed_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index sales_status_idx on public.sales (status);
create index sales_created_at_idx on public.sales (created_at desc);

create trigger sales_set_updated_at
  before update on public.sales
  for each row execute function public.set_updated_at();

create table public.sale_items (
  id           uuid primary key default gen_random_uuid(),
  sale_id      uuid not null references public.sales (id) on delete cascade,
  product_id   uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price   numeric(12, 2) not null check (unit_price >= 0),
  quantity     integer not null check (quantity > 0),
  subtotal     numeric(12, 2) generated always as (unit_price * quantity) stored
);

create index sale_items_sale_id_idx on public.sale_items (sale_id);
create index sale_items_product_id_idx on public.sale_items (product_id);

-- ---------------------------------------------------------------------
-- RPC: el cliente (anónimo) crea su reporte de venta.
-- Los precios y el total se calculan en el servidor a partir de la
-- tabla de productos, así el cliente no puede alterarlos.
-- p_items: [{ "product_id": "uuid", "quantity": 2 }, ...]
-- ---------------------------------------------------------------------
create or replace function public.create_sale(
  p_customer_name  text,
  p_customer_email text,
  p_reference      text,
  p_proof_path     text,
  p_items          jsonb,
  p_customer_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sale_id uuid;
  v_item    jsonb;
  v_product public.products%rowtype;
  v_qty     integer;
  v_total   numeric(12, 2) := 0;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'La venta debe tener al menos un producto';
  end if;

  if coalesce(trim(p_customer_name), '') = '' or coalesce(trim(p_customer_email), '') = '' then
    raise exception 'Nombre y correo son obligatorios';
  end if;

  if coalesce(trim(p_reference), '') = '' then
    raise exception 'La referencia de pago es obligatoria';
  end if;

  if coalesce(trim(p_proof_path), '') = '' then
    raise exception 'La foto del comprobante es obligatoria';
  end if;

  insert into public.sales (customer_name, customer_email, customer_phone, reference, proof_path)
  values (
    trim(p_customer_name),
    lower(trim(p_customer_email)),
    nullif(trim(coalesce(p_customer_phone, '')), ''),
    trim(p_reference),
    p_proof_path
  )
  returning id into v_sale_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::integer;

    if v_qty is null or v_qty <= 0 then
      raise exception 'Cantidad inválida';
    end if;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid
      and is_active;

    if not found then
      raise exception 'Uno de los productos ya no está disponible';
    end if;

    if v_product.stock < v_qty then
      raise exception 'Stock insuficiente para "%"', v_product.name;
    end if;

    insert into public.sale_items (sale_id, product_id, product_name, unit_price, quantity)
    values (v_sale_id, v_product.id, v_product.name, v_product.price, v_qty);

    v_total := v_total + v_product.price * v_qty;
  end loop;

  update public.sales set total = v_total where id = v_sale_id;

  return v_sale_id;
end;
$$;

revoke all on function public.create_sale(text, text, text, text, jsonb, text) from public;
grant execute on function public.create_sale(text, text, text, text, jsonb, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Trigger: al aprobar una venta se descuenta el stock; si una venta
-- aprobada cambia a otro estado, el stock se devuelve.
-- ---------------------------------------------------------------------
create or replace function public.handle_sale_status_change()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_item record;
begin
  if new.status = old.status then
    return new;
  end if;

  if new.status = 'approved' then
    for v_item in
      select product_id, product_name, quantity
      from public.sale_items
      where sale_id = new.id and product_id is not null
    loop
      update public.products
      set stock = stock - v_item.quantity
      where id = v_item.product_id and stock >= v_item.quantity;

      if not found then
        raise exception 'Stock insuficiente para "%"', v_item.product_name;
      end if;
    end loop;
  elsif old.status = 'approved' then
    update public.products p
    set stock = p.stock + si.quantity
    from public.sale_items si
    where si.sale_id = new.id and si.product_id = p.id;
  end if;

  new.reviewed_at = case when new.status = 'pending' then null else now() end;
  return new;
end;
$$;

create trigger sales_status_change
  before update of status on public.sales
  for each row execute function public.handle_sale_status_change();

-- ---------------------------------------------------------------------
-- Permisos de tabla (la seguridad real la dan las políticas RLS)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
grant select, update, delete on public.sales, public.sale_items to authenticated;
grant select on public.admin_users to authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.sales       enable row level security;
alter table public.sale_items  enable row level security;

-- admin_users: cada usuario solo ve su propia fila
create policy "admin_users: ver la propia"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

-- categories: lectura pública, escritura solo admin
create policy "categories: lectura pública"
  on public.categories for select to anon, authenticated
  using (true);

create policy "categories: admin inserta"
  on public.categories for insert to authenticated
  with check ((select public.is_admin()));

create policy "categories: admin actualiza"
  on public.categories for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "categories: admin elimina"
  on public.categories for delete to authenticated
  using ((select public.is_admin()));

-- products: el público ve solo los activos, el admin ve todos
create policy "products: lectura"
  on public.products for select to anon, authenticated
  using (is_active or (select public.is_admin()));

create policy "products: admin inserta"
  on public.products for insert to authenticated
  with check ((select public.is_admin()));

create policy "products: admin actualiza"
  on public.products for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "products: admin elimina"
  on public.products for delete to authenticated
  using ((select public.is_admin()));

-- sales: solo admin (los clientes crean vía la RPC create_sale)
create policy "sales: admin lee"
  on public.sales for select to authenticated
  using ((select public.is_admin()));

create policy "sales: admin actualiza"
  on public.sales for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "sales: admin elimina"
  on public.sales for delete to authenticated
  using ((select public.is_admin()));

-- sale_items: solo admin
create policy "sale_items: admin lee"
  on public.sale_items for select to authenticated
  using ((select public.is_admin()));

create policy "sale_items: admin actualiza"
  on public.sale_items for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "sale_items: admin elimina"
  on public.sale_items for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Storage
--   products        -> público (imágenes del catálogo), escribe el admin
--   payment-proofs  -> privado (fotos de comprobantes), sube cualquiera,
--                      solo el admin puede verlas (URLs firmadas)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('products', 'products', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('payment-proofs', 'payment-proofs', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "products bucket: admin lee"
  on storage.objects for select to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));

create policy "products bucket: admin sube"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and (select public.is_admin()));

create policy "products bucket: admin actualiza"
  on storage.objects for update to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));

create policy "products bucket: admin elimina"
  on storage.objects for delete to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));

create policy "payment-proofs bucket: cualquiera sube"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'payment-proofs');

create policy "payment-proofs bucket: admin lee"
  on storage.objects for select to authenticated
  using (bucket_id = 'payment-proofs' and (select public.is_admin()));

create policy "payment-proofs bucket: admin elimina"
  on storage.objects for delete to authenticated
  using (bucket_id = 'payment-proofs' and (select public.is_admin()));
