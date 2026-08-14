"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { Product } from "@/lib/products";

export default function QuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(10,10,8,0.6)',display:'grid',placeItems:'center',zIndex:60}}>
      <div style={{width:'min(940px,94vw)',background:'var(--white)',padding:24,borderRadius:10,position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',right:16,top:16,border:0,background:'transparent'}} aria-label="Close"><X/></button>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,alignItems:'center'}}>
          <div style={{position:'relative',height:360}}><Image src={product.image} alt={product.name} fill sizes="50vw"/></div>
          <div>
            <p className="eyebrow">{product.category}</p>
            <h2 style={{fontFamily:'Playfair Display'}}>{product.name}</h2>
            <p style={{fontWeight:600}}>{product.price == null ? 'Price coming soon' : `₹${product.price}`}</p>
            <p style={{color:'#596055'}}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
