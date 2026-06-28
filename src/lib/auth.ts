import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SessionUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
};

/** Returns the current user (with admin flag) or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    isAdmin: Boolean(profile?.is_admin),
  };
}
