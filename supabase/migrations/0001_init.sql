-- ============================================================================
-- ReModa initial schema
-- Single curated seller, unique items (quantity = 1), guest checkout + optional
-- customer accounts, Teya payments, Dropp shipping.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type product_status as enum ('available', 'reserved', 'sold');
create type product_gender as enum ('women', 'men', 'unisex');
create type product_condition as enum ('new_with_tags', 'excellent', 'good', 'fair');
create type order_status as enum ('pending', 'paid', 'failed', 'shipped', 'cancelled');

-- ---------------------------------------------------------------------------
-- Profiles (mirrors auth.users; holds admin flag + customer details)
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.is_admin from profiles p where p.id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Products (each row is one unique garment)
-- ---------------------------------------------------------------------------
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  brand text,
  gender product_gender not null default 'women',
  category text not null,
  size text,
  color text,
  condition product_condition not null default 'good',
  measurements jsonb not null default '{}'::jsonb,
  price_isk integer not null check (price_isk >= 0),
  original_price_isk integer check (original_price_isk >= 0),
  status product_status not null default 'available',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_gender_idx on products (gender);
create index products_category_idx on products (category);
create index products_status_idx on products (status);
create index products_created_idx on products (created_at desc);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  storage_path text not null,
  alt text,
  position integer not null default 0
);
create index product_images_product_idx on product_images (product_id, position);

-- ---------------------------------------------------------------------------
-- Reservations: short-lived lock so two buyers can't take the same item
-- ---------------------------------------------------------------------------
create table reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  session_id text not null,
  order_id uuid,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
-- Only one active reservation per product (partial unique on non-expired rows is
-- enforced in application logic; this index speeds lookups).
create index reservations_product_idx on reservations (product_id);
create index reservations_expires_idx on reservations (expires_at);

-- A product is purchasable when available and not actively reserved.
create or replace function is_product_available(p_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from products p
    where p.id = p_id
      and p.status = 'available'
      and p.published = true
  )
  and not exists (
    select 1 from reservations r
    where r.product_id = p_id
      and r.expires_at > now()
  );
$$;

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create sequence if not exists order_number_seq start 1000;

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('RM-' || nextval('order_number_seq')::text),
  user_id uuid references auth.users (id) on delete set null,
  customer_email text not null,
  customer_name text not null,
  phone text,
  status order_status not null default 'pending',
  subtotal_isk integer not null default 0,
  shipping_isk integer not null default 0,
  total_isk integer not null default 0,
  dropp_location_id text,
  dropp_location_name text,
  dropp_barcode text,
  teya_payment_ref text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index orders_user_idx on orders (user_id);
create index orders_created_idx on orders (created_at desc);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  title_snapshot text not null,
  brand_snapshot text,
  size_snapshot text,
  price_isk_snapshot integer not null
);
create index order_items_order_idx on order_items (order_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- New auth user -> profile row
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table reservations enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Profiles: a user sees/updates their own; admins see all.
create policy profiles_select_own on profiles
  for select using (id = auth.uid() or is_admin());
create policy profiles_update_own on profiles
  for update using (id = auth.uid());

-- Products: public can read published & not-sold; admins manage everything.
create policy products_public_read on products
  for select using (published = true);
create policy products_admin_all on products
  for all using (is_admin()) with check (is_admin());

create policy product_images_public_read on product_images
  for select using (
    exists (select 1 from products p where p.id = product_id and p.published = true)
  );
create policy product_images_admin_all on product_images
  for all using (is_admin()) with check (is_admin());

-- Reservations & orders are managed through the service role in server actions,
-- which bypasses RLS. Admins can read for the dashboard; customers read own orders.
create policy reservations_admin_read on reservations
  for select using (is_admin());

create policy orders_admin_read on orders
  for select using (is_admin());
create policy orders_owner_read on orders
  for select using (user_id is not null and user_id = auth.uid());

create policy order_items_admin_read on order_items
  for select using (is_admin());
create policy order_items_owner_read on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- ============================================================================
-- Storage bucket for product images
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product images admin write" on storage.objects
  for insert with check (bucket_id = 'product-images' and is_admin());
create policy "product images admin update" on storage.objects
  for update using (bucket_id = 'product-images' and is_admin());
create policy "product images admin delete" on storage.objects
  for delete using (bucket_id = 'product-images' and is_admin());
