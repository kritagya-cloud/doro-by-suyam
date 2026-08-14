 "use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function Cart() {
  const { items, subtotal, setQty, remove } = useCart();
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;
  return <section className="section cart-page">
    <div className="section-heading"><div><p className="eyebrow">YOUR DORO BAG</p><h1>Ready to gift?</h1></div></div>
    {items.length === 0 ? <div className="empty-state"><h2>Your bag is waiting.</h2><p>Add something lovely to get started.</p><Link className="primary-button" href="/shop">Shop Doro</Link></div> :
    <div className="cart-layout"><div className="cart-items">{items.map(({product, quantity}) => <div className="cart-item" key={product.id}><div className="cart-thumb"><Image src={product.image} alt={product.name} fill sizes="100px"/></div><div className="cart-item-copy"><Link href={`/product/${product.id}`}><h3>{product.name}</h3></Link><p>₹{product.price}</p><div className="qty"><button onClick={() => setQty(product.id, quantity-1)}><Minus size={14}/></button><span>{quantity}</span><button onClick={() => setQty(product.id, quantity+1)}><Plus size={14}/></button></div></div><button className="remove" onClick={() => remove(product.id)}><Trash2 size={17}/></button></div>)}</div>
    <aside className="summary"><h2>Summary</h2><div><span>Subtotal</span><b>₹{subtotal}</b></div><div><span>Shipping</span><b>₹{shipping}</b></div><hr/><div className="total"><span>Total</span><b>₹{total}</b></div><Link href="/checkout" className="primary-button full">Checkout on WhatsApp</Link><p className="muted">Shipping is currently set to ₹50. You can change this in the backend later.</p></aside></div>}
  </section>;
}
