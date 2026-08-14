"use client";

import { useState } from "react";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import type { Product } from "@/lib/products";

export default function ProductActions({ product }: { product: Product }) {
  const { add, setQty } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQuantity] = useState(1);

  function handleAdd() {
    for (let i = 0; i < qty; i++) add(product);
  }

  function buyOnWhatsApp() {
    const lines = [`*${product.name}* x ${qty} — ₹${(product.price||0)*qty}`];
    const message = `🎀 *Doro order*\n\n${lines.join("\n")}\n\n*Qty:* ${qty}\n*Total:* ₹${(product.price||0)*qty}\n\nPlease confirm availability and payment options.`;
    const url = makeWhatsAppUrl(message);
    window.location.href = url;
  }

  return (
    <div className="product-actions">
      <div style={{display:'flex',gap:10,alignItems:'center',marginTop:12}}>
        <label style={{display:'flex',gap:8,alignItems:'center'}}><small>Qty</small><input type="number" min={1} value={qty} onChange={e => setQuantity(Math.max(1, Number(e.target.value||1)))} style={{width:72,padding:8}}/></label>
        <button className="primary-button" onClick={handleAdd} disabled={product.price==null}><ShoppingBag size={18}/> Add to bag</button>
        <button className="secondary-button" onClick={buyOnWhatsApp}>Order on WhatsApp</button>
        <button className="icon-button" onClick={() => toggle(product)} aria-label="wishlist"><Heart size={18} style={{color: has(product.id) ? 'var(--red)' : 'var(--olive)'}}/></button>
      </div>
    </div>
  );
}
