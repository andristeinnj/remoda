export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True once the public Supabase env vars are present. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function publicImageUrl(storagePath: string): string {
  if (!SUPABASE_URL) return storagePath;
  if (storagePath.startsWith("http")) return storagePath;
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${storagePath}`;
}
