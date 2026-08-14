import { getSupabaseAdmin } from "@/lib/supabase";

export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  try {
    const userRes = await supabase.auth.getUser(token);
    const user = userRes?.data?.user;
    if (!user) return false;
    const { data: admins, error } = await supabase.from("admins").select("*").eq("user_id", user.id).limit(1);
    if (error) return false;
    return Array.isArray(admins) && admins.length > 0;
  } catch {
    return false;
  }
}
