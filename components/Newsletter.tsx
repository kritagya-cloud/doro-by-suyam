"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // simple client-side success state; owner can wire to mailing provider later
    setDone(true);
  }
  return (
    <div className="newsletter">
      <h3>Join the Doro list</h3>
      <p>Get early access to new arrivals and special gift edits.</p>
      {done ? <p className="muted">Thanks — you’re on the list.</p> : <form onSubmit={submit} className="newsletter-form"><input type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} required/><button className="secondary-button">Subscribe</button></form>}
    </div>
  );
}
