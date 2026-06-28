# ReModa

Icelandic online store for reselling second-hand clothing (women & men). Single
curated seller — every item is unique (quantity 1). Guest checkout with optional
accounts, payments via **Teya SecurePay**, shipping via **Dropp.is**.

## Stack

- **Next.js 16** (App Router, RSC, Server Actions) + TypeScript
- **Tailwind CSS v4** with the ReModa palette (lavender-purple / deep-pink / banana-cream / deep-sky-blue / aquamarine)
- **Supabase** — Postgres, Auth, Storage (product images)
- **Teya SecurePay** (hosted page) for payments
- **Dropp.is** for pickup-point shipping
- Hosted on **Vercel**

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

The app runs **without any environment variables** using sample products and a
simulated checkout, so you can develop the UI immediately. Wire up the services
below for the real thing.

## Connecting Supabase

1. Create a Supabase project (region eu-north-1 / Stockholm recommended for IS).
2. Apply the schema: run `supabase/migrations/0001_init.sql` in the SQL editor
   (or `supabase db push` with the CLI). This creates the tables, RLS policies,
   triggers and the public `product-images` storage bucket.
3. Copy `.env.example` → `.env.local` and fill in
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`.
4. Create your admin user: sign up at `/nyskraning`, then in Supabase run
   `update profiles set is_admin = true where id = '<your-user-id>';`
5. Manage the catalog at `/admin`.

Regenerate DB types after schema changes:

```bash
supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts
```

## Connecting Teya (payments)

Set `TEYA_MODE`, `TEYA_MERCHANT_ID`, `TEYA_PAYMENT_GATEWAY_ID`, `TEYA_SECRET`.
Signing and result field names live in `src/lib/teya.ts` — confirm the exact
SecurePay hash recipe and amount units against your Teya onboarding pack. The
server-to-server callback `/api/teya/webhook` is the source of truth that marks
orders paid, flips products to sold and books the Dropp shipment.

## Connecting Dropp (shipping)

Set `DROPP_API_KEY` (and `DROPP_API_BASE`). Endpoint paths and request/response
shapes live in `src/lib/dropp.ts` — map them to the real Dropp API
([docs](https://documenter.getpostman.com/view/1057001/SzKPU13n)). Until set, a
sample list of pickup points is used.

## Project structure

```
src/
  app/
    (shop)/ konur, karlar, leit, vara/[slug]   # catalog
    karfa/                                       # cart
    kassi/                                       # checkout + confirmation
    (auth)/ innskraning, nyskraning             # auth
    minar-sidur/                                # customer account + orders
    admin/                                      # product & order management
    api/teya/webhook                            # payment callback
  components/  ui, layout, product, cart, checkout, auth, admin
  lib/         supabase/, queries, orders, teya, dropp, catalog, money, shipping
supabase/migrations/0001_init.sql
```

## Deploy (Vercel)

Push to GitHub, import into Vercel, add all env vars from `.env.example`, set
`NEXT_PUBLIC_SITE_URL` to the production domain, and deploy.
