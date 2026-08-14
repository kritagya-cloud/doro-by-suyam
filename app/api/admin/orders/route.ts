import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyAdminToken } from "@/lib/admin";

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ orders: [] });
  const auth = request.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!await verifyAdminToken(auth)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data || [] });
}
