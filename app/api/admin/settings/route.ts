import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyAdminToken } from "@/lib/admin";

export async function PUT(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!await verifyAdminToken(auth)) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  try {
    const body = await req.json();
    const key = body.key;
    const value = body.value;
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    const { data, error } = await supabase.from('settings').upsert({ key, value });
    if (error) throw error;
    return NextResponse.json({ ok: true, setting: data?.[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
