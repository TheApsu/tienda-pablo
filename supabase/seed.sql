-- Datos de ejemplo (opcional). Ejecutar después de la migración inicial.

insert into public.categories (name, description) values
  ('Bebidas', 'Jugos, refrescos y cafés'),
  ('Snacks', 'Para picar entre comidas'),
  ('Accesorios', 'Termos, vasos y más')
on conflict (name) do nothing;

insert into public.products (category_id, name, description, price, stock)
select c.id, p.name, p.description, p.price, p.stock
from (values
  ('Bebidas', 'Café de especialidad 250 g', 'Tueste medio, notas de chocolate.', 12.50, 20),
  ('Bebidas', 'Jugo natural de naranja', 'Botella de 500 ml.', 3.00, 50),
  ('Snacks', 'Mix de frutos secos', 'Almendras, nueces y merey. 200 g.', 6.75, 30),
  ('Accesorios', 'Termo de acero 500 ml', 'Mantiene la temperatura 12 h.', 18.00, 10)
) as p(category, name, description, price, stock)
join public.categories c on c.name = p.category;
