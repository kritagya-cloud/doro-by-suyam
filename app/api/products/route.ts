import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { products as fallbackProducts } from "@/lib/products";

function normalizeProduct(product: any) {
  if (!product) return product;
  const image = product.primary_image || product.image || null;
  return {
    ...product,
    image,
    images: product.images || (image ? [image] : []),
  };
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ products: fallbackProducts });
  const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1000);
  if (error) return NextResponse.json({ products: fallbackProducts });
  const products = (data || []).map(normalizeProduct);
  return NextResponse.json({ products: products.length ? products : fallbackProducts });
}
