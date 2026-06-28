-- ============================================================================
-- Consignment marketplace
-- Sellers register items online, get a QR swing-tag, ship to ReModa; we confirm
-- reception, photograph (or seller uploads), approve the seller-proposed price,
-- and list it. On sale ReModa keeps 30%, seller gets 70% (manual bank payout).
-- ============================================================================

-- --- Seller fields on profiles ---
alter table profiles
  add column if not exists is_seller boolean not null default false,
  add column if not exists kennitala text,
  add column if not exists iban text,
  add column if not exists bank_name text,
  add column if not exists payout_email text,
  add column if not exists address text,
  add column if not exists postcode text,
  add column if not exists city text;

-- --- Consignment fields on products ---
alter table products
  add column if not exists seller_id uuid references auth.users (id) on delete set null,
  add column if not exists proposed_price_isk integer check (proposed_price_isk >= 0),
  add column if not exists commission_rate numeric(4,2) not null default 0.30,
  add column if not exists qr_token text unique,
  add column if not exists intake_status text not null default 'listed'
    check (intake_status in ('awaiting_reception','received','listed','rejected')),
  add column if not exists rejection_reason text,
  add column if not exists photos_by text check (photos_by in ('admin','seller')),
  add column if not exists received_at timestamptz,
  add column if not exists approved_at timestamptz;

create index if not exists products_seller_idx on products (seller_id);
create index if not exists products_intake_idx on products (intake_status);

-- --- Payouts owed to sellers (70% on each sold item) ---
create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users (id) on delete set null,
  product_id uuid references products (id) on delete set null,
  order_id uuid references orders (id) on delete set null,
  gross_isk integer not null,
  commission_isk integer not null,
  amount_isk integer not null,
  status text not null default 'pending' check (status in ('pending','paid','cancelled')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists payouts_seller_idx on payouts (seller_id);
create index if not exists payouts_status_idx on payouts (status);

alter table payouts enable row level security;

-- --- RLS: sellers manage their own draft items + read their payouts ---
create policy products_seller_insert on products
  for insert with check (seller_id = auth.uid());
create policy products_seller_select on products
  for select using (seller_id = auth.uid());
create policy products_seller_update on products
  for update using (
    seller_id = auth.uid() and intake_status in ('awaiting_reception','received')
  ) with check (seller_id = auth.uid());

create policy product_images_seller_all on product_images
  for all using (
    exists (select 1 from products p where p.id = product_id and p.seller_id = auth.uid())
  ) with check (
    exists (select 1 from products p where p.id = product_id and p.seller_id = auth.uid())
  );

create policy payouts_seller_read on payouts
  for select using (seller_id = auth.uid());
create policy payouts_admin_all on payouts
  for all using (is_admin()) with check (is_admin());
