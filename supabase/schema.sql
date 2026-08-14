create extension if not exists "pgcrypto";

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

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  key text primary key,
  value text
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  quantity integer not null,
  unit_price integer not null
);

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public storefront can read active products.
drop policy if exists "public read active products" on products;
create policy "public read active products" on products for select using (is_active = true);

-- The server uses the service-role key for order inserts and admin reads.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in the browser.
