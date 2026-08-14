import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import { products as fallbackProducts } from "@/lib/products";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Metadata } from "next";

function normalizeProduct(product: any) {
  if (!product) return product;
  const image = product.primary_image || product.image || null;
  return {
    ...product,
    image,
    images: product.images || (image ? [image] : []),
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = getSupabaseAdmin();
  let rawProduct: any = null;

  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('id', params.slug).single();
    rawProduct = data;
  }

  if (!rawProduct) {
    rawProduct = fallbackProducts.find(p => p.id === params.slug) || null;
  }

  const product = normalizeProduct(rawProduct);
  if (!product) return {};
  return {
    title: `${product.name} — Doro by Suyam`,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] }
  };
}

export default async function ProductPage({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();
  let rawProduct: any = null;

  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('id', slug).single();
    rawProduct = data;
  }

  if (!rawProduct) {
    rawProduct = fallbackProducts.find(p => p.id === slug) || null;
  }

  const product = normalizeProduct(rawProduct);
  if (!product) notFound();
  return <section className="section product-page">
    <Link href="/shop" className="back-link">← Back to shop</Link>
    <div className="product-detail">
      <div className="detail-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 800px) 100vw, 55vw"/></div>
      <div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><div className="detail-price">{product.price == null ? "Price coming soon" : `₹${product.price}`}</div><p>{product.description}</p><div className="quality"><span>✦ Premium quality</span><span>✦ Gift-ready</span><span>✦ Thoughtfully packed</span></div><ProductActions product={product}/></div>
    </div>
  </section>;
}
