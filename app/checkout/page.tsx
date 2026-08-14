 "use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!items.length) return <section className="section empty-state"><h1>Your bag is empty.</h1><Link href="/shop" className="primary-button">Shop Doro</Link></section>;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const form = new FormData(e.currentTarget);
    const gift = form.get("giftMessage");
    const payload = {
      customer: { name: form.get("name"), phone: form.get("phone"), address: form.get("address"), city: form.get("city"), state: form.get("state"), pincode: form.get("pincode") },
      items: items.map(x => ({ productId: x.product.id, name: x.product.name, quantity: x.quantity, price: x.product.price })),
      subtotal, shipping: 50, total: subtotal + 50,
      giftMessage: gift
    };
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create order");
      clear();
      // Open WhatsApp click-to-chat with prepared message returned by the server
      window.location.href = data.whatsappUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return <section className="section checkout-page">
    <div className="section-heading"><div><p className="eyebrow">CHECKOUT</p><h1>Let&apos;s send some joy.</h1></div></div>
    <div className="checkout-layout"><form className="checkout-form" onSubmit={submit}><label>Full name<input name="name" required placeholder="Your name"/></label><label>WhatsApp / phone number<input name="phone" required placeholder="98765 43210"/></label><label>Address<textarea name="address" required placeholder="House / street / locality"/></label><div className="two-col"><label>City<input name="city" required/></label><label>State<input name="state" required/></label></div><label>Pincode<input name="pincode" inputMode="numeric" required/></label><label>Gift message <small className="muted">(optional)</small><textarea name="giftMessage" placeholder="A short note to include with the gift"></textarea></label>{error && <p className="error">{error}</p>}<button className="primary-button full" disabled={loading}>{loading ? "Creating your order..." : "Place order on WhatsApp"}</button><p className="muted">Your order is saved first, then WhatsApp opens with a ready-to-send message.</p></form>
    <aside className="summary"><h2>Your gift bag</h2>{items.map(x => <div key={x.product.id}><span>{x.product.name} × {x.quantity}</span><b>₹{(x.product.price || 0)*x.quantity}</b></div>)}<hr/><div><span>Subtotal</span><b>₹{subtotal}</b></div><div><span>Shipping</span><b>₹50</b></div><div className="total"><span>Total</span><b>₹{subtotal+50}</b></div></aside></div>
  </section>;
}
