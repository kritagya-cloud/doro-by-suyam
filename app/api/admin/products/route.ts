import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyAdminToken } from "@/lib/admin";

export async function GET(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ products: [] });
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!await verifyAdminToken(auth)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data || [] });
}

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!await verifyAdminToken(auth)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const body = await req.json();
    const payload = {
      id: body.id,
      name: body.name,
      description: body.description,
      price: body.price || null,
      category: body.category || 'Gifts',
      image: body.image || null,
      primary_image: body.primary_image || null,
      images: body.images || null,
      stock: body.stock || 0,
      is_active: body.is_active !== false,
      created_at: new Date()
    };
    const { data, error } = await supabase.from('products').insert(payload);
    if (error) throw error;
    return NextResponse.json({ product: data?.[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!await verifyAdminToken(auth)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const body = await req.json();
    const id = body.id;
    const updates = { ...body };
    delete updates.id;
    const { data, error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ product: data?.[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  const auth = req.headers.get("authorization")?.replace("Bearer ", "") || "";
  if (!await verifyAdminToken(auth)) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
