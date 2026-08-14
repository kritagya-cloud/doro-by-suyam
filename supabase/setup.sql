-- Supabase project setup for Doro by Suyam
-- Safe to run on the existing project schema.
-- This script does not drop existing tables or overwrite data.

-- 1. Admins / admin authorization
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_admins_user_id on admins(user_id);
alter table admins enable row level security;
drop policy if exists "admins select self" on admins;
create policy "admins select self" on admins for select using (
  user_id = auth.uid()
);

-- 2. Settings
create table if not exists settings (
  key text primary key,
  value text
);
alter table settings enable row level security;
drop policy if exists "admins manage settings" on settings;
create policy "admins manage settings" on settings for all using (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
) with check (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
);

-- 3. Products RLS
create table if not exists products (
  id text primary key,
  name text not null,
  description text,
  price integer,
  category text not null,
  image text,
  primary_image text,
  images jsonb,
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products add column if not exists primary_image text;
alter table products add column if not exists images jsonb;
alter table products enable row level security;

drop policy if exists "public read active products" on products;
create policy "public read active products" on products for select using (
  is_active = true
);

drop policy if exists "admins manage products" on products;
create policy "admins manage products" on products for all using (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
) with check (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
);

create index if not exists idx_products_is_active on products(is_active);
create index if not exists idx_products_created_at on products(created_at);

-- 4. Orders RLS
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  address text not null,
  city text,
  state text,
  pincode text,
  gift_message text,
  subtotal integer not null default 0,
  shipping integer not null default 0,
  total integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;
drop policy if exists "admins manage orders" on orders;
create policy "admins manage orders" on orders for all using (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
) with check (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
);

create index if not exists idx_orders_created_at on orders(created_at);
create index if not exists idx_orders_status on orders(status);

-- 5. Order_items RLS
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity integer not null,
  unit_price integer not null
);

alter table order_items enable row level security;
drop policy if exists "admins manage order_items" on order_items;
create policy "admins manage order_items" on order_items for all using (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
) with check (
  auth.role() = 'service_role'
  or exists (select 1 from public.admins where user_id = auth.uid())
);

create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);

-- 6. Product image Storage bucket
-- Replace 'product-images' below if you use a different bucket name,
-- but keep the same value in .env.local / SUPABASE_PRODUCT_IMAGES_BUCKET.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'product-images') THEN
    PERFORM storage.create_bucket('product-images', true);
  END IF;
END$$;

-- 7. Storage RLS policies for product image uploads
alter table storage.objects enable row level security;
drop policy if exists "admins manage product-images objects" on storage.objects;
create policy "admins manage product-images objects" on storage.objects for all using (
  bucket_id = 'product-images'
  and (
    auth.role() = 'service_role'
    or exists (select 1 from public.admins where user_id = auth.uid())
  )
) with check (
  bucket_id = 'product-images'
  and (
    auth.role() = 'service_role'
    or exists (select 1 from public.admins where user_id = auth.uid())
  )
);

-- 8. Any required indexes/constraints
-- The primary keys are already defined above.
-- The following index is useful for admin lookups and RLS checks.
create index if not exists idx_admins_user_id on admins(user_id);

-- 9. Required seed/admin setup
-- Replace <ADMIN_USER_UUID> with the Supabase Auth user ID for your admin account.
-- You can find it in the Supabase Auth dashboard after creating the admin user.

-- insert into admins (user_id)
-- select '<ADMIN_USER_UUID>'
-- where not exists (select 1 from admins where user_id = '<ADMIN_USER_UUID>');

-- Optional settings seed examples (replace the values):
-- insert into settings (key, value) values
--   ('whatsapp_number', '919876543210')
--   ,('instagram_url', 'https://instagram.com/yourprofile')
-- on conflict (key) do update set value = excluded.value;
