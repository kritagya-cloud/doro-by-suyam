 "use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import QuickView from "@/components/QuickView";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [open, setOpen] = useState(false);
  return (
    <article className="product-card">
      <Link href={`/product/${product.id}`} className="product-image">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" />
      </Link>
      <div className="product-info">
        <div>
          <p className="eyebrow">{product.category}</p>
          <Link href={`/product/${product.id}`}><h3>{product.name}</h3></Link>
          <p className="price">{product.price == null ? "Price coming soon" : `₹${product.price}`}</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="icon small" aria-label="Quick view" onClick={() => setOpen(true)}>
            <Eye size={16} style={{color: 'var(--olive)'}} />
          </button>
          <button className="icon small" aria-label="Wishlist" onClick={() => toggle(product)}>
            <Heart size={16} style={{color: has(product.id) ? 'var(--red)' : 'var(--olive)'}} />
          </button>
          <button className="small-cart" onClick={() => product.price != null && add(product)} disabled={product.price == null}>
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
      {open && <QuickView product={product} onClose={() => setOpen(false)} />}
    </article>
  );
}
