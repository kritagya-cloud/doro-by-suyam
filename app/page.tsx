import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import FeaturedCollections from "@/components/FeaturedCollections";
import Testimonials from "@/components/Testimonials";
import InstagramGrid from "@/components/InstagramGrid";
import Newsletter from "@/components/Newsletter";
import { getSupabaseAdmin } from "@/lib/supabase";
import { products as fallbackProducts } from "@/lib/products";

function normalizeProduct(product: any) {
  const image = product.primary_image || product.image || null;
  return {
    ...product,
    image,
    images: product.images || (image ? [image] : []),
  };
}

export default async function Home() {
  const supabase = getSupabaseAdmin();
  let products = fallbackProducts;

  if (supabase) {
    const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1000);
    if (!error && data) {
      products = data.map(normalizeProduct);
    }
  }

  const featured = products.filter(p => p.price != null).slice(0, 6);
  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">DORO BY SUYAM</p>
        <h1>Gifts that say what words can&apos;t.</h1>
        <p>Thoughtfully chosen jewellery, handmade art & little treasures for the people who mean the most.</p>
        <div className="hero-buttons"><Link href="/shop" className="primary-button">Shop gifts</Link><Link href="/customised-hamper" className="secondary-button">Customised Hamper</Link></div>
      </div>
      <div className="hero-art"><div className="hero-ribbon">a little<br/><em>something</em><br/>for you</div></div>
    </section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">CURATED FOR YOU</p><h2>Shop by feeling</h2></div><Link href="/shop">View all →</Link></div>
      <div className="feeling-grid">
        <Link href="/shop?category=Jewellery"><span>♡</span><b>For her</b><small>Little luxuries</small></Link>
        <Link href="/shop?category=Handmade%20Art"><span>✿</span><b>Just because</b><small>Made to brighten days</small></Link>
        <Link href="/shop"><span>✦</span><b>Make it special</b><small>Thoughtful gifting</small></Link>
        <Link href="/shop"><span>♡</span><b>I love you</b><small>Say it beautifully</small></Link>
      </div>
    </section>

    <section className="section cream-section">
      <div className="section-heading"><div><p className="eyebrow">DORO FAVOURITES</p><h2>Little treasures</h2></div><Link href="/shop">Shop all →</Link></div>
      <div className="product-grid">{featured.map(p => <ProductCard key={p.id} product={p}/>)}</div>
    </section>
    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">COLLECTIONS</p><h2>Curated edits</h2></div></div>
      <FeaturedCollections />
    </section>

    <section className="story-banner">
      <div><p className="eyebrow">THE DORO PROMISE</p><h2>Made for the moment they open the box.</h2><p>Beautiful pieces, warm details and gifting that feels personal.</p><Link href="/shop" className="primary-button">Find their gift</Link></div>
    </section>

    <section className="section cream-section">
      <div className="section-heading"><div><p className="eyebrow">WHAT PEOPLE SAY</p><h2>Testimonials</h2></div></div>
      <Testimonials />
    </section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">SOCIAL</p><h2>From Instagram</h2></div></div>
      <InstagramGrid />
    </section>

    <section className="section cream-section">
      <div className="section-heading"><div><p className="eyebrow">STAY IN TOUCH</p><h2>Newsletter</h2></div></div>
      <Newsletter />
    </section>
  </>;
}
