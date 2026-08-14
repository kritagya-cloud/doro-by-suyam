import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ settings: {} });
  const { data, error } = await supabase.from('settings').select('*');
  if (error) return NextResponse.json({ settings: {} });
  const obj: Record<string,string> = {};
  (data || []).forEach((r: any) => { obj[r.key] = r.value; });
  return NextResponse.json({ settings: obj });
}
