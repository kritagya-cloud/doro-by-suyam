import { getSupabaseAdmin } from "@/lib/supabase";

export async function verifyAdminToken(token: string): Promise<boolean> {
  console.log("=== ADMIN AUTH CHECK ===");

  if (!token) {
    console.log("❌ No token received");
    return false;
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.log("❌ Supabase admin client could not be created");
    return false;
  }

  try {
    const userRes = await supabase.auth.getUser(token);

    if (userRes.error) {
      console.log("❌ getUser error:", userRes.error.message);
      return false;
    }

    const user = userRes.data.user;

    if (!user) {
      console.log("❌ No user found from token");
      return false;
    }

    console.log("✅ Authenticated user:", user.email);
    console.log("✅ User ID:", user.id);

    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.log("❌ Admin table error:", error.message);
      return false;
    }

    if (!admin) {
      console.log("❌ User is NOT in admins table");
      return false;
    }

    console.log("✅ User IS an admin");
    console.log("Admin record:", admin);

    return true;
  } catch (error) {
    console.log("❌ Admin verification exception:", error);
    return false;
  }
}