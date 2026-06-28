-- ============================================================================
-- Security hardening (addresses Supabase advisor warnings)
-- ============================================================================

-- Pin search_path on functions that were missing it.
alter function public.is_product_available(uuid) set search_path = public;
alter function public.set_updated_at() set search_path = public;

-- Trigger functions must not be callable via the REST API.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;

-- Public buckets serve files via public object URLs without a broad SELECT
-- policy; dropping it stops clients from listing every file in the bucket.
drop policy if exists "product images public read" on storage.objects;
